import { describe, expect, it, vi } from 'vitest';
import Header from './Header.svelte';
import { render } from '@testing-library/svelte';

describe('Header', () => {
	it('should render the title of the header', () => {
		const { getByText } = render(Header, { title: 'Test' });
		const title = getByText('Test');
		expect(title).not.toBeNull();
	});

	it('should render the title of the header and no skeleton if not loading', () => {
		const { queryByTestId } = render(Header, { title: 'Test', loading: false });
		const title = queryByTestId('header-title');
		const skeleton = queryByTestId('header-skeleton');
		expect(title).not.toBeNull();
		expect(skeleton).toBeNull();
	});

	it('should render a skeleton for the header if loading', () => {
		const { queryByTestId } = render(Header, { title: 'Test', loading: true });
		const title = queryByTestId('header-title');
		const skeleton = queryByTestId('header-skeleton');
		expect(title).toBeNull();
		expect(skeleton).not.toBeNull();
	});

	it('should render the backlink with correct href if backlink is provided', () => {
		const { getByTestId } = render(Header, { title: 'Test', backLink: '/route' });
		const backLink = getByTestId('backLink');
		expect(backLink).not.toBeNull();
		expect(backLink?.getAttribute('href')).toBe('/route');
	});

	it('should not render the backlink if backlink is not provided', () => {
		const { queryByTestId } = render(Header, { title: 'Test' });
		const backLink = queryByTestId('backLink');
		expect(backLink).toBeNull();
	});

	it('should render options when provided', () => {
		const { getByTestId } = render(Header, {
			title: 'Test',
			options: [
				{
					title: 'Test',
					callback: () => {},
					icon: undefined
				}
			]
		});
		const options = getByTestId('options');
		expect(options).not.toBeNull();
	});

	it('should not render options when not provided', () => {
		const { queryByTestId } = render(Header, { title: 'Test' });
		const options = queryByTestId('options');
		expect(options).toBeNull();
	});

	it('should render all provided options', () => {
		const { getAllByTestId } = render(Header, {
			title: 'Test',
			options: [
				{
					title: 'Test1',
					callback: () => {},
					icon: undefined
				},
				{
					title: 'Test2',
					callback: () => {},
					icon: undefined
				}
			]
		});
		const options = getAllByTestId('option');
		expect(options.length).toBe(2);
	});

	it('should render the correct title for each option', () => {
		const options = [
			{
				title: 'Test1',
				callback: () => {},
				icon: undefined
			},
			{
				title: 'Test2',
				callback: () => {},
				icon: undefined
			}
		];
		const { getByText } = render(Header, {
			title: 'Test',
			options: options
		});

		options.forEach((option) => {
			const optionElement = getByText(option.title);
			expect(optionElement).not.toBeNull();
		});
	});

	it('should call the correct callback when an option is clicked', () => {
		const options = [
			{
				title: 'Test1',
				callback: vi.fn(),
				icon: undefined
			},
			{
				title: 'Test2',
				callback: vi.fn(),
				icon: undefined
			}
		];
		const { getAllByTestId } = render(Header, {
			title: 'Test',
			options: options
		});

		const optionElements = getAllByTestId('option-button');
		optionElements.forEach((option, index) => {
			option.click();
			expect(options[index].callback).toHaveBeenCalled();
		});
	});

	it('should render the correct icon for each option', () => {
		const options = [
			{
				title: 'Test1',
				callback: () => {},
				icon: 'icon1'
			},
			{
				title: 'Test2',
				callback: () => {},
				icon: 'icon2'
			}
		];
		const { getAllByTestId } = render(Header, {
			title: 'Test',
			options: options
		});

		const optionElements = getAllByTestId('option-icon');
		optionElements.forEach((option, index) => {
			expect(option.getAttribute('src')).toBe(options[index].icon);
		});
	});

	it('should render no icon for an option if not provided', () => {
		const options = [
			{
				title: 'Test1',
				callback: vi.fn(),
				icon: undefined
			},
			{
				title: 'Test2',
				callback: vi.fn(),
				icon: undefined
			}
		];
		const { queryAllByTestId } = render(Header, {
			title: 'Test',
			options: options
		});
		const optionIcon = queryAllByTestId('option-icon');
		expect(optionIcon).toHaveLength(0);
	});
});
