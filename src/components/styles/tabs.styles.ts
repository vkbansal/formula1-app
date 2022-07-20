import { injectGlobal } from '@emotion/css';

injectGlobal`
.tabs {
  & .tab-list {
		display: grid;
	  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		padding: 0 1rem;
  }

  & .tab {
    padding: 1rem;
    cursor: pointer;
		border: 1px solid transparent;
		border-radius: 0.5rem 0.5rem 0 0;
    z-index: 1;
		text-align: center;
		background-color: var(--f1-red);
		color: white;
		text-transform: uppercase;

    &.tab-active {
      background-color: var(--bg);
			color: var(--text-1);
			font-weight: bold;
			border-color: var(--divider) var(--divider) transparent var(--divider);
    }
  }

  & .tab-panel {
    padding: 1rem 0;
    display: none;
    border: 1px solid var(--divider);
    border-radius: 0 0 0.5rem 0.5rem;
    margin-top: -1px;

    &.tab-active {
      display: block;
    }
  }
}
`;
