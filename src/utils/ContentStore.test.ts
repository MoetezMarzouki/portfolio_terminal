import { describe, it, expect, beforeEach } from 'vitest';
import { ContentStore } from './ContentStore';
import type { PortfolioContent } from '../types';

describe('ContentStore', () => {
  const mockContent: PortfolioContent = {
    about: {
      name: 'Test User',
      title: 'Test Developer',
      summary: 'Test summary',
      location: 'Test City',
      phone: '+1234567890',
    },
    projects: [
      {
        name: 'Test Project',
        description: 'A test project',
        technologies: ['TypeScript', 'React'],
        links: [{ type: 'github', url: 'https://github.com/test' }],
        period: '2024',
      },
    ],
    skills: [
      {
        category: 'Languages',
        skills: [{ name: 'TypeScript', proficiency: 'expert' }],
      },
    ],
    experience: [
      {
        company: 'Test Company',
        role: 'Developer',
        startDate: '2024-01',
        endDate: 'present',
        responsibilities: ['Testing'],
      },
    ],
    education: [
      {
        institution: 'Test University',
        degree: 'Test Degree',
        startDate: '2020',
        endDate: '2024',
        status: 'Completed',
        specialization: 'Computer Science',
      },
    ],
    contact: {
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Test City',
      socialLinks: [
        { platform: 'GitHub', url: 'https://github.com/test', username: 'test' },
      ],
    },
  };

  let store: ContentStore;

  beforeEach(() => {
    store = new ContentStore();
  });

  describe('loadContent', () => {
    it('should load valid content', () => {
      store.loadContent(mockContent);
      expect(store.isLoaded()).toBe(true);
    });

    it('should validate and provide defaults for missing fields', () => {
      const partialContent = { about: mockContent.about } as Partial<PortfolioContent>;
      store.loadContent(partialContent as PortfolioContent);
      
      expect(store.getProjects()).toEqual([]);
      expect(store.getSkills()).toEqual([]);
      expect(store.getExperience()).toEqual([]);
    });
  });

  describe('getAbout', () => {
    it('should return about content', () => {
      store.loadContent(mockContent);
      const about = store.getAbout();
      
      expect(about.name).toBe('Test User');
      expect(about.title).toBe('Test Developer');
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getAbout()).toThrow('Content not loaded');
    });
  });

  describe('getProjects', () => {
    it('should return projects array', () => {
      store.loadContent(mockContent);
      const projects = store.getProjects();
      
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe('Test Project');
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getProjects()).toThrow('Content not loaded');
    });
  });

  describe('getSkills', () => {
    it('should return skills by category', () => {
      store.loadContent(mockContent);
      const skills = store.getSkills();
      
      expect(skills).toHaveLength(1);
      expect(skills[0].category).toBe('Languages');
      expect(skills[0].skills[0].name).toBe('TypeScript');
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getSkills()).toThrow('Content not loaded');
    });
  });

  describe('getExperience', () => {
    it('should return experience array', () => {
      store.loadContent(mockContent);
      const experience = store.getExperience();
      
      expect(experience).toHaveLength(1);
      expect(experience[0].company).toBe('Test Company');
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getExperience()).toThrow('Content not loaded');
    });
  });

  describe('getEducation', () => {
    it('should return education array', () => {
      store.loadContent(mockContent);
      const education = store.getEducation();
      
      expect(education).toHaveLength(1);
      expect(education[0].institution).toBe('Test University');
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getEducation()).toThrow('Content not loaded');
    });
  });

  describe('getContact', () => {
    it('should return contact information', () => {
      store.loadContent(mockContent);
      const contact = store.getContact();
      
      expect(contact.email).toBe('test@example.com');
      expect(contact.socialLinks).toHaveLength(1);
    });

    it('should throw error if content not loaded', () => {
      expect(() => store.getContact()).toThrow('Content not loaded');
    });
  });

  describe('isLoaded', () => {
    it('should return false when content not loaded', () => {
      expect(store.isLoaded()).toBe(false);
    });

    it('should return true when content is loaded', () => {
      store.loadContent(mockContent);
      expect(store.isLoaded()).toBe(true);
    });
  });
});
