import type { FunctionComponent } from 'preact';

export const CarIcon: FunctionComponent = () => {
	return (
		<svg
			style="display: none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
		>
			<defs>
				<symbol id="f1-car" viewBox="0 0 512 512">
					<rect fill="black" x="370" y="110" width="25" height="280"></rect>
					<rect
						fill="black"
						rx="10"
						ry="10"
						x="39"
						y="99"
						width="110"
						height="56"
					></rect>
					<rect
						fill="black"
						rx="10"
						ry="10"
						x="39"
						y="360"
						width="110"
						height="56"
					></rect>
					<rect
						fill="black"
						rx="10"
						ry="10"
						x="329"
						y="110"
						width="110"
						height="56"
					></rect>
					<rect
						fill="black"
						rx="10"
						ry="10"
						x="329"
						y="343"
						width="110"
						height="56"
					></rect>
					<rect
						stroke="black"
						stroke-width="5"
						fill="currentColor"
						x="455"
						y="130"
						width="45"
						height="250"
						rx="10"
						ry="10"
					></rect>

					<path
						fill="currentColor"
						stroke="black"
						stroke-width="5"
						d="M500,266 L275,306 L258,358 H80 V154 H258 L275,206 L500,246 A50,20 0 0,1 500,266Z"
					></path>
					<line
						stroke="black"
						stroke-width="5"
						x1="80"
						y1="308"
						x2="258"
						y2="358"
					></line>
					<line
						stroke="black"
						stroke-width="5"
						x1="80"
						y1="204"
						x2="258"
						y2="154"
					></line>
					<rect
						fill="currentColor"
						stroke="black"
						stroke-width="5"
						x="5"
						y="130"
						width="80"
						height="250"
						rx="10"
						ry="10"
					></rect>
					<path
						transform="scale(0.1)"
						style="opacity:0"
						d="M395 2719c-44-25-45-32-45-286v-244l25-24c33-34 70-32 106 5l30 29-3 240c-3 225-4 242-23 260-26 25-65 34-90 20zM375 1935c-22-21-25-33-25-95 0-83 8-103 49-120 24-9 35-9 57 2 39 18 54 52 54 121 0 51-4 62-29 88-36 36-73 37-106 4zM1497 2791c-203-60-382-115-399-122-39-16-68-64-68-112 0-28 8-46 33-72 30-34 52-41 407-147l375-111 212-4c315-7 400 13 492 112 66 71 86 124 86 225 0 73-4 93-28 142-34 70-118 149-184 174-41 15-87 18-303 21l-255 2-368-108zm855-61c114-32 162-168 95-269-43-65-68-71-291-71h-196v350h178c97 0 194-5 214-10zm-552-165c0-125-2-145-16-145-20 0-467 130-476 139-6 5 447 145 485 150 4 1 7-64 7-144z"
					></path>
					<line
						stroke="black"
						stroke-width="10"
						x1="190"
						y1="230"
						x2="190"
						y2="282"
					></line>
					<path
						fill="none"
						stroke="black"
						stroke-width="10"
						stroke-linejoin="round"
						stroke-linecap="round"
						d="M110,256 L190,230 H235 A50,30 0 0,1 235,282 H190Z"
					></path>
				</symbol>
			</defs>
		</svg>
	);
};
