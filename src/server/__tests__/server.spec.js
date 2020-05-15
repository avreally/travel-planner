const { getRoot } = require('../server');

describe('Root route', () => {
	it('should call sendFile', () => {
		const req = {
			sendFile: jest.fn()
		};
		getRoot({}, req);
		expect(req.sendFile).toHaveBeenCalledWith('dist/index.html');
	});
});
