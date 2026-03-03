/**
 * HistoryManager handles command history navigation
 * Following simple terminal portfolio pattern
 */
export class HistoryManager {
  private history: string[] = [];
  private currentIndex: number = -1;
  private maxSize: number = 50;

  /**
   * Add a command to history
   */
  add(command: string): void {
    if (command.trim() === '') return;

    // Add to beginning of history array
    this.history.unshift(command);

    // Limit history size
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(0, this.maxSize);
    }

    // Reset index
    this.currentIndex = -1;
  }

  /**
   * Get previous command (arrow up)
   */
  getPrevious(): string | undefined {
    if (this.history.length === 0) return undefined;

    // Move up in history (increase index)
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
    }

    return this.history[this.currentIndex];
  }

  /**
   * Get next command (arrow down)
   */
  getNext(): string | undefined {
    if (this.history.length === 0) return undefined;

    // Move down in history (decrease index)
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }

    // At the bottom, return empty string
    this.currentIndex = -1;
    return '';
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Get all history
   */
  getAll(): string[] {
    return [...this.history];
  }

  /**
   * Reset navigation index
   */
  resetIndex(): void {
    this.currentIndex = -1;
  }
}
