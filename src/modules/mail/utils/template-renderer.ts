import * as fs from 'fs';
import * as path from 'path';

export class TemplateRenderer {
  private templateCache: Map<string, string> = new Map();

  renderTemplate(templateName: string, variables: Record<string, any>): string {
    const template = this.loadTemplate(templateName);
    return this.replaceVariables(template, variables);
  }

  private loadTemplate(templateName: string): string {
    const cached = this.templateCache.get(templateName);
    if (cached) {
      return cached;
    }

    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.html`,
    );

    const template = fs.readFileSync(templatePath, 'utf-8');
    this.templateCache.set(templateName, template);

    return template;
  }

  private replaceVariables(
    template: string,
    variables: Record<string, any>,
  ): string {
    let result = template;

    Object.keys(variables).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, String(variables[key] || ''));
    });

    return result;
  }

  clearCache(): void {
    this.templateCache.clear();
  }
}

