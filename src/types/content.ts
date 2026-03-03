// Content data types
export interface AboutContent {
  name: string;
  title: string;
  summary: string;
  location: string;
  phone: string;
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'website';
  url: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  period: string;
  highlights?: string[];
}

export type Proficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
  name: string;
  proficiency: Proficiency;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'Ongoing';
  specialization: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface PortfolioContent {
  about: AboutContent;
  projects: Project[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  contact: ContactInfo;
}
