import { h, type VNode, type ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import cx from 'classnames';

export interface Tab {
	id: string;
	title: ComponentChildren;
	content: ComponentChildren;
}

export interface TabsProps {
	tabs: Tab[];
	defaultActiveTab?: string;
}

export function Tabs(props: TabsProps): VNode {
	const [activeTab, setActiveTab] = useState(
		props.defaultActiveTab || props.tabs[0].id,
	);

	return (
		<div class="tabs">
			<div class="tab-list" role="tablist">
				{props.tabs.map((tab) => (
					<div
						key={tab.id}
						role="tab"
						class={cx('tab', { 'tab-active': activeTab === tab.id })}
						onClick={(): void => setActiveTab(tab.id)}
					>
						{tab.title}
					</div>
				))}
			</div>
			{props.tabs.map((tab) => (
				<div
					key={tab.id}
					role="tab-panel"
					class={cx('tab-panel', { 'tab-active': activeTab === tab.id })}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
