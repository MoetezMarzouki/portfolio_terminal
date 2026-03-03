import type { OutputLine } from '../types';
import { HistoryManager } from '../utils/HistoryManager';
import { initializeCommands, executeCommand } from '../commands/commands';
import type { Command } from '../types';
import { Grainient } from './Granient';
import { ProfileCard } from './ProfileCard';

/**
 * Terminal component - main terminal UI
 * Following simple vanilla JS terminal portfolio pattern
 */
export class Terminal {
  private container: HTMLElement;
  private outputContainer: HTMLElement;
  private inputLine: HTMLElement;
  private inputField: HTMLInputElement;
  private historyManager: HistoryManager;
  private commands: Command[];
  private outputHistory: OutputLine[] = [];
  private skipTyping: boolean = false;
  private grainient: Grainient | null = null;
  private profileCard: ProfileCard | null = null;

  constructor(containerId: string, commands: Command[]) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.container = container;
    this.commands = commands;
    this.historyManager = new HistoryManager();

    // Create terminal structure
    this.outputContainer = document.createElement('div');
    this.outputContainer.id = 'terminal-output';

    this.inputLine = document.createElement('div');
    this.inputLine.id = 'input-line';
    this.inputLine.className = 'input-line';

    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.id = 'terminal-input';
    this.inputField.className = 'terminal-input';
    this.inputField.autocomplete = 'off';
    this.inputField.spellcheck = false;

    // Build DOM
    this.inputLine.innerHTML = '<span class="prompt">visitor@moetez:~$</span> ';
    this.inputLine.appendChild(this.inputField);

    this.container.appendChild(this.outputContainer);
    this.container.appendChild(this.inputLine);

    // Add K8s logo
    this.addK8sLogo();

    // Initialize Grainient background with wave-like movement - attach to body for fullscreen
    this.grainient = new Grainient(document.body, {
      timeSpeed: 0.2,
      grainAmount: 0.12,
      contrast: 1.15,
      saturation: 0.9,
      warpSpeed: 2.5,
      warpStrength: 1.5,
      warpFrequency: 2.0,
      warpAmplitude: 30.0,
      rotationAmount: 400.0,
      blendSoftness: 0.15,
      blendAngle: 45.0,
      centerX: 0.0,
      centerY: 0.0,
      zoom: 1.2,
    });

    // Setup event listeners
    this.setupEventListeners();

    // Show welcome message
    this.showWelcome();

    // Focus input
    this.inputField.focus();
  }

  private addK8sLogo(): void {
    const logoContainer = document.createElement('div');
    logoContainer.className = 'k8s-logo';
    logoContainer.innerHTML = `
      <img src="/k8slogo.png" alt="Kubernetes Logo" />
    `;
    this.container.appendChild(logoContainer);
  }

  private setupEventListeners(): void {
    // Handle input
    this.inputField.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Skip typing on any key press (except Enter which submits commands)
    document.addEventListener('keydown', (e) => {
      if (this.inputField.disabled && e.key !== 'Enter') {
        this.skipTyping = true;
      }
    });

    // Skip typing on click
    this.container.addEventListener('click', () => {
      if (this.inputField.disabled) {
        this.skipTyping = true;
      } else {
        this.inputField.focus();
      }
    });
  }

  private async handleKeyDown(e: KeyboardEvent): Promise<void> {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = this.inputField.value.trim();

      // Disable input while processing
      this.inputField.disabled = true;
      this.skipTyping = false; // Reset skip flag

      if (input) {
        // Add to history
        this.historyManager.add(input);

        // Show command in output (instant, no typing)
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line output-command';
        commandLine.innerHTML = `<span class="prompt">visitor@moetez:~$</span> ${input}`;
        this.outputContainer.appendChild(commandLine);

        this.outputHistory.push({
          type: 'command',
          content: `<span class="prompt">visitor@moetez:~$</span> ${input}`,
          timestamp: Date.now(),
        });

        // Execute command
        const result = executeCommand(input, [], this.commands);

        // Check for clear command
        if (result.output[0] === '__CLEAR__') {
          this.clearOutput();
          this.hideProfileCard();
        } else if (result.output[0] === '__SHOW_PROFILE_CARD__') {
          // Show profile card and remove the marker from output
          this.showProfileCard();
          result.output.shift(); // Remove the marker
          
          // Add output with typewriter effect
          for (const line of result.output) {
            const lineElement = document.createElement('div');
            lineElement.className = `output-line output-${result.success ? 'output' : 'error'}`;
            this.outputContainer.appendChild(lineElement);

            this.outputHistory.push({
              type: result.success ? 'output' : 'error',
              content: line,
              timestamp: Date.now(),
            });

            await this.typewriterEffect(lineElement, line, 15);
            this.scrollToBottom();

            // If skip was triggered, break out of loop
            if (this.skipTyping) {
              // Complete all remaining lines instantly
              for (let i = result.output.indexOf(line) + 1; i < result.output.length; i++) {
                const remainingLine = document.createElement('div');
                remainingLine.className = `output-line output-${result.success ? 'output' : 'error'}`;
                remainingLine.innerHTML = result.output[i];
                this.outputContainer.appendChild(remainingLine);

                this.outputHistory.push({
                  type: result.success ? 'output' : 'error',
                  content: result.output[i],
                  timestamp: Date.now(),
                });
              }
              break;
            }
          }
        } else {
          // Normal commands (help, errors, etc.)
          for (const line of result.output) {
            const lineElement = document.createElement('div');
            lineElement.className = `output-line output-${result.success ? 'output' : 'error'}`;
            this.outputContainer.appendChild(lineElement);

            this.outputHistory.push({
              type: result.success ? 'output' : 'error',
              content: line,
              timestamp: Date.now(),
            });

            await this.typewriterEffect(lineElement, line, 15);
            this.scrollToBottom();

            // If skip was triggered, break out of loop
            if (this.skipTyping) {
              // Complete all remaining lines instantly
              for (let i = result.output.indexOf(line) + 1; i < result.output.length; i++) {
                const remainingLine = document.createElement('div');
                remainingLine.className = `output-line output-${result.success ? 'output' : 'error'}`;
                remainingLine.innerHTML = result.output[i];
                this.outputContainer.appendChild(remainingLine);

                this.outputHistory.push({
                  type: result.success ? 'output' : 'error',
                  content: result.output[i],
                  timestamp: Date.now(),
                });
              }
              break;
            }
          }
        }
      } else {
        // Empty command, just show prompt (instant)
        const commandLine = document.createElement('div');
        commandLine.className = 'output-line output-command';
        commandLine.innerHTML = '<span class="prompt">visitor@moetez:~$</span>';
        this.outputContainer.appendChild(commandLine);

        this.outputHistory.push({
          type: 'command',
          content: '<span class="prompt">visitor@moetez:~$</span>',
          timestamp: Date.now(),
        });
      }

      // Clear input and re-enable
      this.inputField.value = '';
      this.inputField.disabled = false;
      this.inputField.focus();
      this.historyManager.resetIndex();
      this.skipTyping = false; // Reset skip flag

      // Scroll to bottom
      this.scrollToBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = this.historyManager.getPrevious();
      if (prev !== undefined) {
        this.inputField.value = prev;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = this.historyManager.getNext();
      if (next !== undefined) {
        this.inputField.value = next;
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      this.clearOutput();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      this.inputField.value = '';
    }
  }

  private addOutput(line: OutputLine): void {
    this.outputHistory.push(line);

    const lineElement = document.createElement('div');
    lineElement.className = `output-line output-${line.type}`;

    this.outputContainer.appendChild(lineElement);

    // Typewriter effect
    this.typewriterEffect(lineElement, line.content);
  }

  private typewriterEffect(element: HTMLElement, text: string, speed: number = 20): Promise<void> {
    return new Promise((resolve) => {
      // If text contains complex HTML (like divs, spans with classes), render it instantly
      if (text.includes('<div') || text.includes('class=')) {
        element.innerHTML = text;
        resolve();
        return;
      }

      let index = 0;

      const type = () => {
        // Check if skip was triggered
        if (this.skipTyping) {
          element.innerHTML = text;
          resolve();
          return;
        }

        if (index < text.length) {
          // Check if we're at the start of an HTML tag
          if (text[index] === '<') {
            // Find the closing >
            const tagEnd = text.indexOf('>', index);
            if (tagEnd !== -1) {
              // Add the entire tag at once
              element.innerHTML += text.substring(index, tagEnd + 1);
              index = tagEnd + 1;
            }
          } else {
            element.innerHTML += text[index];
            index++;
          }

          setTimeout(type, speed);
        } else {
          resolve();
        }
      };

      type();
    });
  }

  private clearOutput(): void {
    this.outputContainer.innerHTML = '';
    this.outputHistory = [];
  }

  private scrollToBottom(): void {
    this.container.scrollTop = this.container.scrollHeight;
  }

  private async showWelcome(): Promise<void> {
    const welcome = [
      '',
      '<span class="ascii-art">███╗   ███╗ ██████╗ ███████╗████████╗███████╗███████╗</span>',
      '<span class="ascii-art">████╗ ████║██╔═══██╗██╔════╝╚══██╔══╝██╔════╝╚══███╔╝</span>',
      '<span class="ascii-art">██╔████╔██║██║   ██║█████╗     ██║   █████╗    ███╔╝ </span>',
      '<span class="ascii-art">██║╚██╔╝██║██║   ██║██╔══╝     ██║   ██╔══╝   ███╔╝  </span>',
      '<span class="ascii-art">██║ ╚═╝ ██║╚██████╔╝███████╗   ██║   ███████╗███████╗</span>',
      '<span class="ascii-art">╚═╝     ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚══════╝</span>',
      '',
      '<span class="ascii-art">    ███╗   ███╗ █████╗ ██████╗ ███████╗ ██████╗ ██╗   ██╗██╗  ██╗██╗</span>',
      '<span class="ascii-art">    ████╗ ████║██╔══██╗██╔══██╗╚══███╔╝██╔═══██╗██║   ██║██║ ██╔╝██║</span>',
      '<span class="ascii-art">    ██╔████╔██║███████║██████╔╝  ███╔╝ ██║   ██║██║   ██║█████╔╝ ██║</span>',
      '<span class="ascii-art">    ██║╚██╔╝██║██╔══██║██╔══██╗ ███╔╝  ██║   ██║██║   ██║██╔═██╗ ██║</span>',
      '<span class="ascii-art">    ██║ ╚═╝ ██║██║  ██║██║  ██║███████╗╚██████╔╝╚██████╔╝██║  ██╗██║</span>',
      '<span class="ascii-art">    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝</span>',
      '',
      '<span class="welcome-subtitle">Cloud & Platform Engineer | Backend / Infrastructure Specialist</span>',
      '',
      '<span class="welcome-tagline">⚡ Building production-grade distributed systems with Kubernetes ⚡</span>',
      '',
      'Type <span class="output-command">kubectl get help</span> to see available commands.',
      '',
    ];

    for (const line of welcome) {
      const lineElement = document.createElement('div');
      lineElement.className = 'output-line output-output';
      this.outputContainer.appendChild(lineElement);

      this.outputHistory.push({
        type: 'output',
        content: line,
        timestamp: Date.now(),
      });

      // Render ASCII art instantly to preserve gradient effect
      if (line.includes('ascii-art')) {
        lineElement.innerHTML = line;
      } else {
        await this.typewriterEffect(lineElement, line, 5);
      }
    }
  }

  public focus(): void {
    this.inputField.focus();
  }

  private showProfileCard(): void {
    if (this.profileCard) {
      return; // Already showing
    }

    this.profileCard = new ProfileCard({
      avatarUrl: '/me_with_sarroura.jpg',
      miniAvatarUrl: '/me_with_sarroura.jpg',
      name: 'Moetez Marzouki',
      title: 'Cloud & Platform Engineer',
      handle: 'moetezmarzouki',
      status: 'Available for opportunities',
      contactText: 'Contact Me',
    });

    const cardElement = this.profileCard.getElement();
    cardElement.style.margin = '20px 0';
    cardElement.style.display = 'flex';
    cardElement.style.justifyContent = 'center';
    cardElement.style.opacity = '0';
    cardElement.style.animation = 'profileCardFadeIn 0.8s ease-out forwards';

    // Insert the card into the output container
    this.outputContainer.appendChild(cardElement);
  }

  private hideProfileCard(): void {
    if (this.profileCard) {
      this.profileCard.destroy();
      this.profileCard = null;
    }
  }
}
