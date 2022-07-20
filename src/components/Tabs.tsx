import { h, type VNode, type ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import cx from 'classnames';

export interface Tab {
	id: string;
	title: ComponentChildren;
	content: ComponentChildren;
	panelClass?: string;
	tabClass?: string;
}

export interface TabsProps {
	tabs: Tab[];
	defaultActiveTab?: number;
	class?: string;
}

export function Tabs(props: TabsProps): VNode {
	const [activeTab, setActiveTab] = useState(props.defaultActiveTab ?? 0);

	return (
		<div class={cx('tabs', props.class)}>
			<div class="tab-list" role="tablist">
				{props.tabs.map((tab, i) => (
					<div
						key={tab.id}
						role="tab"
						class={cx('tab', { 'tab-active': activeTab === i }, tab.tabClass)}
						onClick={(): void => setActiveTab(i)}
					>
						{tab.title}
					</div>
				))}
			</div>
			{props.tabs.map((tab, i) => (
				<div
					key={tab.id}
					role="tab-panel"
					class={cx(
						'tab-panel',
						{
							'tab-active': activeTab === i,
						},
						tab.panelClass,
					)}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
