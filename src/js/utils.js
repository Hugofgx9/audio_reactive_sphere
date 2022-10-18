export function getCurrentURLPath() {
	return window.location.pathname.match(/\/(.*)/m)[1];
}