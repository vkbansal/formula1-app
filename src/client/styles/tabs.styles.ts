import { injectGlobal } from '@emotion/css';

injectGlobal`
.tabs {
  & .tab-list {
    display: flex;
  }

  & .tab {
    padding: 1rem;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0.5rem 0.5rem 0 0;
    z-index: 1;

    &.tab-active {
      color: var(--f1-red);
      border-color: var(--divider) var(--divider) var(--black) var(--divider);
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