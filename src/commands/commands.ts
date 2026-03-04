import type { Command } from '../types';
import { ContentStore } from '../utils/ContentStore';
import { OutputFormatter } from '../utils/OutputFormatter';

/**
 * Initialize commands with content store and formatter
 * Following simple terminal portfolio pattern
 */
export function initializeCommands(
  contentStore: ContentStore,
  formatter: OutputFormatter
): Command[] {
  return [
    {
      name: 'help',
      description: 'Display all available resources',
      usage: 'kubectl get help',
      handler: () => {
        const commands = initializeCommands(contentStore, formatter);
        return {
          success: true,
          output: formatter.formatHelp(commands),
        };
      },
    },
    {
      name: 'about',
      description: 'Display biographical information',
      usage: 'kubectl get about',
      handler: () => {
        const about = contentStore.getAbout();
        return {
          success: true,
          output: ['__SHOW_PROFILE_CARD__', ...formatter.formatAbout(about)],
        };
      },
    },
    {
      name: 'projects',
      description: 'Display portfolio projects',
      usage: 'kubectl get projects',
      handler: () => {
        const projects = contentStore.getProjects();
        return {
          success: true,
          output: formatter.formatProjects(projects),
        };
      },
    },
    {
      name: 'skills',
      description: 'Display technical skills',
      usage: 'kubectl get skills',
      handler: () => {
        const skills = contentStore.getSkills();
        return {
          success: true,
          output: formatter.formatSkills(skills),
        };
      },
    },
    {
      name: 'experience',
      description: 'Display work experience',
      usage: 'kubectl get experience',
      handler: () => {
        const experience = contentStore.getExperience();
        return {
          success: true,
          output: formatter.formatExperience(experience),
        };
      },
    },
    {
      name: 'education',
      description: 'Display educational background',
      usage: 'kubectl get education',
      handler: () => {
        const education = contentStore.getEducation();
        return {
          success: true,
          output: formatter.formatEducation(education),
        };
      },
    },
    {
      name: 'contact',
      description: 'Display contact information',
      usage: 'kubectl get contact',
      handler: () => {
        const contact = contentStore.getContact();
        return {
          success: true,
          output: formatter.formatContact(contact),
        };
      },
    },
    {
      name: 'clear',
      description: 'Clear the terminal output',
      usage: 'clear',
      handler: () => {
        return {
          success: true,
          output: ['__CLEAR__'], // Special marker for terminal to clear
        };
      },
    },
    {
      name: 'stats',
      description: 'Display GitHub stats and metrics',
      usage: 'kubectl get stats',
      handler: () => {
        return {
          success: true,
          output: [
            '',
            '<span class="output-header">📊 Stats & Metrics</span>',
            '',
            `💼 Experience: 3+ years (Freelance)`,
            `🎯 Specialization: Cloud & Platform Engineering`,
            `☸️  Primary Stack: Kubernetes, Go, TypeScript`,
            '',
            '<span class="output-label">GitHub Activity:</span>',
            `📦 Major Projects: KYMA-FLOW IDP, DBaaS Platform`,
            `🔧 Technologies: 15+ tools & frameworks`,
            `🚀 Focus: Production-grade distributed systems`,
            '',
            `<span class="output-label">Profile:</span> <a href="https://github.com/MoetezMarzouki" target="_blank" rel="noopener noreferrer">github.com/MoetezMarzouki</a>`,
            '',
          ],
        };
      },
    },
  ];
}

/**
 * Execute a command by name
 */
export function executeCommand(
  commandName: string,
  args: string[],
  commands: Command[]
): { success: boolean; output: string[]; error?: string } {
  // Parse kubectl-style commands: "kubectl get <resource>"
  const parts = commandName.toLowerCase().split(' ');
  
  if (parts[0] === 'kubectl' && parts[1] === 'get' && parts[2]) {
    const resource = parts[2];
    const command = commands.find((cmd) => cmd.name === resource);
    
    if (!command) {
      return {
        success: false,
        output: [
          '',
          `<span class="output-error">Error: resource '${resource}' not found</span>`,
          `Type <span class="output-command">kubectl get help</span> to see available resources.`,
          '',
        ],
        error: `Resource '${resource}' not found`,
      };
    }
    
    try {
      return command.handler(args);
    } catch (error) {
      return {
        success: false,
        output: [
          '',
          `<span class="output-error">Error executing kubectl get ${resource}</span>`,
          '',
        ],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Fallback for direct command names (backward compatibility)
  const command = commands.find((cmd) => cmd.name === commandName.toLowerCase());

  if (!command) {
    return {
      success: false,
      output: [
        '',
        `<span class="output-error">Command '${commandName}' not found.</span>`,
        `Type <span class="output-command">kubectl get help</span> to see available commands.`,
        '',
      ],
      error: `Command '${commandName}' not found`,
    };
  }

  try {
    return command.handler(args);
  } catch (error) {
    return {
      success: false,
      output: [
        '',
        `<span class="output-error">Error executing command '${commandName}'</span>`,
        '',
      ],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
