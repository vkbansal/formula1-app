import type { RenderableProps, VNode } from 'preact';

declare module 'preact/src/jsx' {
	namespace JSXInternal {
		interface HTMLAttributes {
			charset?: string;
			crossorigin?: boolean;
		}
	}
}

export interface MainLayoutProps {
	title: string;
	externalScripts?: string[];
}

export function MainLayout(
	props: RenderableProps<MainLayoutProps>
): VNode<any> {
	const { title, externalScripts } = props;

	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>{title} | F1 statistics</title>
				<meta name="description" content={title} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Oswald:wght@200;300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href={this.context.filters.assets('styles/styles.scss')}
				/>
			</head>
			<body>
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
						<div class="last-updated" id="">
							<span>Last updated at:&nbsp;</span>
							<span x-text="buildTime.toLocaleString()"></span>
							<span>(Local Time)</span>
						</div>
					</div>
				</footer>
				{Array.isArray(externalScripts)
					? externalScripts.map((href) => (
							<script type="text/javascript" href={href}></script>
					  ))
					: null}
			</body>
		</html>
	);
}
