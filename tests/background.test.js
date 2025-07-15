describe('pingSite', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('should return ok status on successful ping', async () => {
        global.fetch.mockResolvedValueOnce(new Response());
        const result = await pingSite('https://example.com');
        expect(result.status).toBe('ok');
        expect(result.ms).toBeDefined();
        expect(result.attempts).toBe(1);
    });

    test('should retry on failure', async () => {
        global.fetch
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce(new Response());
        
        const result = await pingSite('https://example.com');
        expect(result.status).toBe('ok');
        expect(result.attempts).toBe(2);
    });
});