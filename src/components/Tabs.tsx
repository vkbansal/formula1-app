import { h, type VNode, type ComponentChildren, toChildArray, type RenderableProps } from 'preact';
import { useState } from 'preact/hooks';
import cx from 'classnames';

export interface TabPanelProps {
	id: string;
	title: ComponentChildren;
	class?: string;
	titleClass?: string;
}

export interface TabsProps {
	defaultActiveTab?: number;
	class?: string;
	children: VNode<TabPanelProps> | VNode<TabPanelProps>[];
}

export function Tabs(props: TabsProps): VNode {
	const [activeTab, setActiveTab] = useState(props.defaultActiveTab ?? 0);
	const tabs = toChildArray(props.children).filter(
		(c) => (c as VNode<TabPanelProps>).type == TabsPanel,
	) as VNode<TabPanelProps>[];

	return (
		<div class={cx('tabs', props.class)}>
			<div class="tab-list" role="tablist">
				{tabs.map((tab, i) => (
					<div
						key={tab.props.id}
						role="tab"
						class={cx('tab', { 'tab-active': activeTab === i }, tab.props.titleClass)}
						onClick={(): void => setActiveTab(i)}
					>
						{tab.props.title}
					</div>
				))}
			</div>
			{tabs.map((tab, i) => (
				<div
					key={tab.props.id}
					role="tabpanel"
					class={cx(
						'tab-panel',
						{
							'tab-active': activeTab === i,
						},
						tab.props.class,
					)}
				>
					{tab.props.children}
				</div>
			))}
		</div>
	);
}

function TabsPanel(props: RenderableProps<TabPanelProps>): VNode {
	return <div>{props.children}</div>;
}

Tabs.Panel = TabsPanel;
