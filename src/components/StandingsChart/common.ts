export const MARGIN = { top: 30, right: 30, bottom: 100, left: 50 };
export const TOTAL_WIDTH = 900;
export const TOTAL_HEIGHT = 600;
export const CHART_WIDTH = TOTAL_WIDTH - MARGIN.left - MARGIN.right;
export const CHART_HEIGHT = TOTAL_HEIGHT - MARGIN.top - MARGIN.bottom;
export const STROKE_WIDTH = 3;
export const Y_STEP = 20;
export const MOUSE_OFFSET = 20;

export interface ChartPoint {
	position: number;
	points: number;
	wins: number;
	podium: number[];
}

export interface ChartData {
	label: string;
	link: string;
	id: string;
	data: Array<ChartPoint | null>;
}
