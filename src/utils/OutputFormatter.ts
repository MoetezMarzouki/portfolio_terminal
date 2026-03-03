import type {
  AboutContent,
  Project,
  SkillCategory,
  Experience,
  Education,
  ContactInfo,
  Command,
} from '../types';

/**
 * OutputFormatter formats content for terminal display.
 * Follows simple terminal portfolio pattern with HTML for links.
 */
export class OutputFormatter {
  /**
   * Format about/biographical information
   */
  formatAbout(content: AboutContent): string[] {
    return [
      '',
      `<span class="output-name">${content.name}</span>`,
      `<span class="output-title">${content.title}</span>`,
      '',
      content.summary,
      '',
      `📍 ${content.location}`,
      `📱 ${content.phone}`,
      '',
    ];
  }

  /**
   * Format projects list with links
   */
  formatProjects(projects: Project[]): string[] {
    const output: string[] = ['', '<span class="output-header">Projects</span>', ''];

    projects.forEach((project, index) => {
      output.push(`<span class="output-project-name">${index + 1}. ${project.name}</span>`);
      output.push(`   ${project.description}`);
      output.push('');
      output.push(`   <span class="output-label">Period:</span> ${project.period}`);
      output.push(
        `   <span class="output-label">Technologies:</span> ${project.technologies.join(', ')}`
      );

      if (project.highlights && project.highlights.length > 0) {
        output.push('   <span class="output-label">Highlights:</span>');
        project.highlights.forEach((highlight) => {
          output.push(`   • ${highlight}`);
        });
      }

      if (project.links.length > 0) {
        output.push('   <span class="output-label">Links:</span>');
        project.links.forEach((link) => {
          output.push(
            `   • <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.type}: ${link.url}</a>`
          );
        });
      }

      output.push('');
    });

    return output;
  }

  /**
   * Format skills by category
   */
  formatSkills(skills: SkillCategory[]): string[] {
    const output: string[] = ['', '<span class="output-header">Skills</span>', ''];

    skills.forEach((category) => {
      output.push(`<span class="output-category">${category.category}</span>`);
      category.skills.forEach((skill) => {
        const proficiencyBar = this.getProficiencyBar(skill.proficiency);
        output.push(`  ${skill.name.padEnd(25)} ${proficiencyBar}`);
      });
      output.push('');
    });

    return output;
  }

  /**
   * Format work experience
   */
  formatExperience(experience: Experience[]): string[] {
    const output: string[] = ['', '<span class="output-header">Experience</span>', ''];

    experience.forEach((exp) => {
      output.push(`<span class="output-company">${exp.company}</span>`);
      output.push(`<span class="output-role">${exp.role}</span>`);
      output.push(`${exp.startDate} - ${exp.endDate}`);
      output.push('');
      exp.responsibilities.forEach((resp) => {
        output.push(`• ${resp}`);
      });
      output.push('');
    });

    return output;
  }

  /**
   * Format education history
   */
  formatEducation(education: Education[]): string[] {
    const output: string[] = ['', '<span class="output-header">Education</span>', ''];

    education.forEach((edu) => {
      output.push(`<span class="output-institution">${edu.institution}</span>`);
      output.push(`${edu.degree} (${edu.status})`);
      output.push(`${edu.startDate} - ${edu.endDate}`);
      output.push(`<span class="output-label">Specialization:</span> ${edu.specialization}`);
      output.push('');
    });

    return output;
  }

  /**
   * Format contact information with social links
   */
  formatContact(contact: ContactInfo): string[] {
    const output: string[] = ['', '<span class="output-header">Contact</span>', ''];

    output.push(`📧 Email: ${contact.email}`);
    output.push(`📱 Phone: ${contact.phone}`);
    output.push(`📍 Location: ${contact.location}`);
    output.push('');

    if (contact.socialLinks.length > 0) {
      output.push('<span class="output-label">Social Links:</span>');
      contact.socialLinks.forEach((link) => {
        output.push(
          `• ${link.platform}: <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.username}</a>`
        );
      });
      output.push('');
    }

    return output;
  }

  /**
   * Format error message
   */
  formatError(message: string): string[] {
    return ['', `<span class="output-error">Error: ${message}</span>`, ''];
  }

  /**
   * Format help command output
   */
  formatHelp(commands: Command[]): string[] {
    const output: string[] = [
      '',
      '<span class="output-header">Available Commands</span>',
      '',
      'Type any of the following commands:',
      '',
    ];

    commands.forEach((cmd) => {
      output.push(`  <span class="output-command">${cmd.usage.padEnd(30)}</span> ${cmd.description}`);
    });

    output.push('');
    return output;
  }

  /**
   * Get proficiency bar visualization
   */
  private getProficiencyBar(proficiency: string): string {
    const levels = {
      beginner: '▓░░░░',
      intermediate: '▓▓▓░░',
      advanced: '▓▓▓▓░',
      expert: '▓▓▓▓▓',
    };
    return levels[proficiency as keyof typeof levels] || '░░░░░';
  }
}
