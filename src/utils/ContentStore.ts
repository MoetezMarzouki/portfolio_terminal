import type {
  PortfolioContent,
  AboutContent,
  Project,
  SkillCategory,
  Experience,
  Education,
  ContactInfo,
} from '../types';

/**
 * ContentStore manages portfolio content loaded from a static JSON file.
 * Provides synchronous access to all content sections.
 */
export class ContentStore {
  private content: PortfolioContent | null = null;

  constructor(content?: PortfolioContent) {
    if (content) {
      this.content = this.validateContent(content);
    }
  }

  /**
   * Load content from a JSON object
   */
  loadContent(content: PortfolioContent): void {
    this.content = this.validateContent(content);
  }

  /**
   * Validate content structure and provide defaults for missing fields
   */
  private validateContent(content: Partial<PortfolioContent>): PortfolioContent {
    return {
      about: content.about || {
        name: 'Unknown',
        title: 'Developer',
        summary: 'No summary available',
        location: '',
        phone: '',
      },
      projects: content.projects || [],
      skills: content.skills || [],
      experience: content.experience || [],
      education: content.education || [],
      contact: content.contact || {
        email: '',
        phone: '',
        location: '',
        socialLinks: [],
      },
    };
  }

  /**
   * Get about/biographical information
   */
  getAbout(): AboutContent {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.about;
  }

  /**
   * Get all projects
   */
  getProjects(): Project[] {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.projects;
  }

  /**
   * Get skills organized by category
   */
  getSkills(): SkillCategory[] {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.skills;
  }

  /**
   * Get work experience history
   */
  getExperience(): Experience[] {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.experience;
  }

  /**
   * Get education history
   */
  getEducation(): Education[] {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.education;
  }

  /**
   * Get contact information
   */
  getContact(): ContactInfo {
    if (!this.content) {
      throw new Error('Content not loaded');
    }
    return this.content.contact;
  }

  /**
   * Check if content is loaded
   */
  isLoaded(): boolean {
    return this.content !== null;
  }
}
