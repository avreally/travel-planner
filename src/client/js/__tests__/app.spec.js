import { getData } from '../app';

describe('getData', () => {
	it('should call fetch with both url and parameters', async () => {
		const mockSuccessResponse = {};
		const mockJsonPromise = Promise.resolve(mockSuccessResponse);
		const mockFetchPromise = Promise.resolve({
			json: () => mockJsonPromise
		});
		global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

		await getData('https://pixabay.com/api/?image_type=photo&category=places&q=', 'test');

		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith('https://pixabay.com/api/?image_type=photo&category=places&q=test');

		global.fetch.mockClear();
		delete global.fetch;
	});
});
