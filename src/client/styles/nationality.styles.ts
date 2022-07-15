import { injectGlobal } from '@emotion/css';

injectGlobal`
.nationality {
	&::before {
		content: '#{$value}';
		font-size: 1.5em;
		margin-right: 0.35rem;
		line-height: 2px;
	}

	&.american::before {
		content: '🇺🇸';
	}

	&.american_italian::before {
		content: '🇺🇸';
	}

	&.argentine::before {
		content: '🇦🇷';
	}

	&.argentine_italian::before {
		content: '🇦🇷';
	}

	&.australian::before {
		content: '🇦🇺';
	}

	&.austrian::before {
		content: '🇦🇹';
	}

	&.belgian::before {
		content: '🇧🇪';
	}

	&.brazilian::before {
		content: '🇧🇷';
	}

	&.british::before {
		content: '🇬🇧';
	}

	&.canadian::before {
		content: '🇨🇦';
	}

	&.chilean::before {
		content: '🇨🇱';
	}

	&.chinese::before {
		content: '🇨🇳';
	}

	&.colombian::before {
		content: '🇨🇴';
	}

	&.czech::before {
		content: '🇨🇿';
	}

	&.danish::before {
		content: '🇩🇰';
	}

	&.dutch::before {
		content: '🇳🇱';
	}

	&.east_german::before {
		content: '🇩🇪';
	}

	&.finnish::before {
		content: '🇫🇮';
	}

	&.french::before {
		content: '🇫🇷';
	}

	&.german::before {
		content: '🇩🇪';
	}

	&.hungarian::before {
		content: '🇭🇺';
	}

	&.indian::before {
		content: '🇮🇳';
	}

	&.indonesian::before {
		content: '🇮🇩';
	}

	&.irish::before {
		content: '🇮🇪';
	}

	&.italian::before {
		content: '🇮🇹';
	}

	&.japanese::before {
		content: '🇯🇵';
	}

	&.liechtensteiner::before {
		content: '🇱🇮';
	}

	&.malaysian::before {
		content: '🇲🇾';
	}

	&.mexican::before {
		content: '🇲🇽';
	}

	&.monegasque::before {
		content: '🇲🇨';
	}

	&.new_zealander::before {
		content: '🇳🇿';
	}

	&.polish::before {
		content: '🇵🇱';
	}

	&.portuguese::before {
		content: '🇵🇹';
	}

	&.rhodesian::before {
		content: '';
	}

	&.russian::before {
		content: '🇷🇺';
	}

	&.south_african::before {
		content: '🇿🇦';
	}

	&.spanish::before {
		content: '🇪🇸';
	}

	&.swedish::before {
		content: '🇸🇪';
	}

	&.swiss::before {
		content: '🇨🇭';
	}

	&.thai::before {
		content: '🇹🇭';
	}

	&.uruguayan::before {
		content: '🇺🇾';
	}

	&.venezuelan::before {
		content: '🇻🇪';
	}
}

`;
