import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Point {
  x: number;
  y: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface GeneratedElements {
  points: Point[];
  lines: Line[];
}

@Component({
  selector: 'app-polygon-level',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './polygon-level.component.html',
  styleUrls: ['./polygon-level.component.css']
})
export class PolygonLevelComponent {
  @Input() levels: number[] = [];
  @Input() labels?: string[];
  @Input() label?: string;

  readonly maxOffset = 50;
  readonly centerX = 60;
  readonly centerY = 60;

  get numPoints(): number {
    return this.levels?.length || 0;
  }

  get shouldDisplay(): boolean {
    return this.numPoints > 0;
  }

  get backgroundLevels10(): number[] {
    return Array(this.numPoints).fill(10);
  }

  get backgroundLevels5(): number[] {
    return Array(this.numPoints).fill(5);
  }

  get background10Elements(): GeneratedElements {
    return this.generatePointsAndLines(this.backgroundLevels10, 'darkgray', this.labels || []);
  }

  get background5Elements(): GeneratedElements {
    return this.generatePointsAndLines(this.backgroundLevels5, 'lightgray', []);
  }

  get foregroundElements(): GeneratedElements {
    return this.generatePointsAndLines(this.levels, 'blue', []);
  }

  private generatePointsAndLines(
    levels: number[],
    color: string,
    labels: string[]
  ): GeneratedElements {
    const points: Point[] = [];
    const lines: Line[] = [];

    levels.forEach((level, i) => {
      let x: number, y: number;

      if (level === 0) {
        x = this.centerX;
        y = this.centerY;
      } else {
        const normalizedLevel = Math.max(0, Math.min(level, 10)) / 10;
        const offset = this.maxOffset * normalizedLevel;
        const angle = (2 * Math.PI * i) / this.numPoints;
        x = this.centerX + offset * Math.cos(angle);
        y = this.centerY + offset * Math.sin(angle);
      }

      points.push({ x, y });

      // Generate lines
      if (i > 0) {
        const prevLevel = levels[i - 1];
        let prevX: number, prevY: number;

        if (prevLevel === 0) {
          prevX = this.centerX;
          prevY = this.centerY;
        } else {
          const prevNormalizedLevel = Math.max(0, Math.min(prevLevel, 10)) / 10;
          const prevOffset = this.maxOffset * prevNormalizedLevel;
          const prevAngle = (2 * Math.PI * (i - 1)) / this.numPoints;
          prevX = this.centerX + prevOffset * Math.cos(prevAngle);
          prevY = this.centerY + prevOffset * Math.sin(prevAngle);
        }

        lines.push({
          x1: prevX,
          y1: prevY,
          x2: x,
          y2: y
        });
      }

      // Close the polygon - connect last point to first
      if (i === this.numPoints - 1 && this.numPoints > 1) {
        let firstX: number, firstY: number;

        if (levels[0] === 0) {
          firstX = this.centerX;
          firstY = this.centerY;
        } else {
          const firstNormalizedLevel = Math.max(0, Math.min(levels[0], 10)) / 10;
          const firstOffset = this.maxOffset * firstNormalizedLevel;
          const firstAngle = 0;
          firstX = this.centerX + firstOffset * Math.cos(firstAngle);
          firstY = this.centerY + firstOffset * Math.sin(firstAngle);
        }

        lines.push({
          x1: x,
          y1: y,
          x2: firstX,
          y2: firstY
        });
      }
    });

    return { points, lines };
  }

  getPointPosition(index: number, level: number): Point {
    if (level === 0) {
      return { x: this.centerX, y: this.centerY };
    }

    const normalizedLevel = Math.max(0, Math.min(level, 10)) / 10;
    const offset = this.maxOffset * normalizedLevel;
    const angle = (2 * Math.PI * index) / this.numPoints;

    return {
      x: this.centerX + offset * Math.cos(angle),
      y: this.centerY + offset * Math.sin(angle)
    };
  }

  getLabelPosition(index: number): Point {
    const level = 10; // Labels are positioned at the outer edge
    const normalizedLevel = 1;
    const offset = (this.maxOffset + 15) * normalizedLevel; // Add extra offset for labels
    const angle = (2 * Math.PI * index) / this.numPoints;

    return {
      x: this.centerX + offset * Math.cos(angle),
      y: this.centerY + offset * Math.sin(angle)
    };
  }
}
