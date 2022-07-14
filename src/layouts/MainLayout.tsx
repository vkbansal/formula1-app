import type { RenderableProps, VNode } from 'preact';

export interface MainLayoutProps {}

export function MainLayout(
	props: RenderableProps<MainLayoutProps>
): VNode<any> {
	return (
		<>
			<header class="main-header">
				<div class="container">
					<a href="/" class="logo">
						<span>F1</span>
						<span>Statistics</span>
					</a>
					{/* {% if page.url != "/" %}
        <nav class="main-nav">
          <a href="/seasons"  class="{{ "active" if page.url | startsWith("/season") }}">Seasons</a>
          <a href="/constructors"  class="{{ "active" if page.url | startsWith("/constructors") }}">Constructors</a>
          <a href="/drivers" class="{{ "active" if page.url | startsWith("/drivers") }}">Drivers</a>
          {# <a href="/circuits" disabled  class="'active': path.startsWith('/circuits')">Circuits</a> #}
          <a href="/about" class="{{ "active" if page.url | startsWith("/about") }}">About</a>
        </nav>
        {% endif %}
				<div class="container breadcrumbs-container">
      <div class="breadcrumbs">
        <a href="/">🏠</a>
        {% block breadcrumbs %}{% endblock %}
      </div>
    </div>
				*/}
				</div>
			</header>
			<div class="container content-wrapper">{props.children}</div>
			<footer class="main-footer">
				<div class="container">
					<p>
						Made with ❤️ by{' '}
						<a href="https://vkbansal.me/">Vivek Kumar Bansal</a>
					</p>
					<div
						class="last-updated"
						x-data="{buildTime: new Date({{buildTime}})}"
					>
						<span>Last updated at:&nbsp;</span>
						<span x-text="buildTime.toLocaleString()"></span>
						<span>(Local Time)</span>
					</div>
				</div>
			</footer>
			<script
				type="text/javascript"
				src="https://unpkg.com/alpinejs@3.10.2/dist/cdn.min.js"
			></script>
		</>
	);
}
