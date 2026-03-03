// Terminal UI types
export type OutputLineType = 'command' | 'output' | 'error';

export interface OutputLine {
  type: OutputLineType;
  content: string;
  timestamp: number;
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    cursor: string;
    selection: string;
    prompt: string;
    command: string;
    output: string;
    error: string;
    link: string;
  };
  font: string;
}

export interface ApplicationState {
  outputHistory: OutputLine[];
  commandHistory: string[];
  currentInput: string;
  historyIndex: number;
  currentTheme: Theme;
  isProcessing: boolean;
}
