import './style.css';
import { Terminal } from './components/Terminal';
import { ContentStore } from './utils/ContentStore';
import { OutputFormatter } from './utils/OutputFormatter';
import { initializeCommands } from './commands/commands';
import contentData from './data/content.json';
import type { PortfolioContent } from './types';

// Initialize content store
const contentStore = new ContentStore();
contentStore.loadContent(contentData as PortfolioContent);

// Initialize formatter
const formatter = new OutputFormatter();

// Initialize commands
const commands = initializeCommands(contentStore, formatter);

// Initialize terminal
const terminal = new Terminal('app', commands);

// Make terminal globally accessible for debugging
(window as any).terminal = terminal;
