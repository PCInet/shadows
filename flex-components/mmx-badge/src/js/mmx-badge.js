/**
 * MMX PCINET / BADGE
 */

class MMXPCINET_Badge extends MMXPCINET_Element {

	static get props() {
		return {
			style: {
				options: ['primary', 'secondary', 'display-link', 'primary-link', 'secondary-link', 'dark-primary', 'dark-secondary', 'dark-display-link', 'dark-primary-link', 'dark-secondary-link', 'pill'],
				default: 'primary'
			},
			size: {
				options: ['xs', 's', 'm', 'l'],
				default: 'm'
			},
			width: {
				options: ['auto', 'full'],
				default: 'auto'
			},
			type: {
				options: ['submit', 'reset', 'button', 'link'],
				default: '' // Default can be either `button` or `link` and is determined in getType()
			},
			'styles': {
				allowAny: true,
				default: ''
			},
			shape: {
				options: ['normal', 'round'],
				default: 'normal'
			},
		};
	}

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-badge'];
	hideOnEmpty = true;

	constructor() {
		super();
		this.makeShadow();
	}

	render() {
		return /*html*/`
			<div class="mmx-pcinet-badge" ${this.inheritAttrs()} part="badge">
				<slot></slot>
			</div>
		`;
	}
}

if (!customElements.get('mmx-pcinet-badge')){
	customElements.define('mmx-pcinet-badge', MMXPCINET_Badge);
}