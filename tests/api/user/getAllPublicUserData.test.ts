import { POST } from "../../../app/api/user/getAllPublicUserData/route";

describe("getAllPublicUserData", () => {
  it("returns an error when email parameter is missing", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({}),
    };

    const response = await POST(mockReq);
    expect(response.status).toEqual(400);
    const responseJson = await response.json();
    expect(responseJson).toEqual({
      error: "Missing parameters: email",
    });
  });
});
