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
    {
      name: 'commits',
      description: 'Display recent GitHub commits',
      usage: 'kubectl get commits',
      handler: async () => {
        try {
          const response = await fetch('https://api.github.com/users/MoetezMarzouki/events/public?per_page=10');
          if (!response.ok) throw new Error('Failed to fetch commits');
          
          const events = await response.json();
          const pushEvents = events.filter((e: any) => e.type === 'PushEvent').slice(0, 4);
          
          const output = [
            '',
            '<span class="output-header">🔥 Recent Commits</span>',
            '',
          ];

          if (pushEvents.length === 0) {
            output.push('No recent commits found.');
          } else {
            pushEvents.forEach((event: any) => {
              const repo = event.repo.name;
              const commits = event.payload.commits || [];
              
              commits.slice(0, 1).forEach((commit: any) => {
                const message = commit.message.split('\n')[0];
                const shortMessage = message.length > 60 ? message.substring(0, 60) + '...' : message;
                const timeAgo = getTimeAgo(new Date(event.created_at));
                
                output.push(`<span class="output-label">${repo}:</span> ${shortMessage}`);
                output.push(`  <span style="color: #888">└─ ${timeAgo}</span>`);
                output.push('');
              });
            });
          }

          output.push(`<span class="output-label">View all:</span> <a href="https://github.com/MoetezMarzouki" target="_blank" rel="noopener noreferrer">github.com/MoetezMarzouki</a>`);
          output.push('');

          return {
            success: true,
            output,
          };
        } catch (error) {
          return {
            success: false,
            output: [
              '',
              '<span class="output-error">Failed to fetch recent commits</span>',
              'Please check your internet connection or try again later.',
              '',
            ],
          };
        }
      },
    },
  ];
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

/**
 * Execute a command by name
 */
export async function executeCommand(
  commandName: string,
  args: string[],
  commands: Command[]
): Promise<{ success: boolean; output: string[]; error?: string }> {
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
      return await command.handler(args);
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
    return await command.handler(args);
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
