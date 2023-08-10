import { POST } from "../../../app/api/user/settings/route";
jest.mock("../../../utils/db/user/getAllPublicUserData");
describe("User Route POST function", () => {
  it("returns an error when email parameter is missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({}),
    };

    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      error: "Missing parameters: email",
    });
  });

  // ... Add more test cases
});
