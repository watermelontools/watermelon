import { POST } from "../../../app/api/user/settings/route";
import getUserSettings from "../../../utils/db/user/settings";
jest.mock("../../../utils/db/user/settings");

const mockedGetUserSettings = getUserSettings as jest.Mock;
mockedGetUserSettings.mockResolvedValue({
  userSettings: {
    AISummary: true,
    JiraTickets: 5,
    SlackMessages: 5,
    GitHubPRs: 5,
    NotionPages: 5,
    LinearTickets: 5,
    ConfluenceDocs: 5,
  },
});
jest.mock("../../../utils/db/user/settings");
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

  it("Gets the userSettings", async () => {
    // Mocking request object
    const mockReq: any = {
      json: async () => ({
        email: "tulia@watermelontools.com",
      }),
    };

    const response = await (await POST(mockReq)).json();
    expect(response).toEqual({
      userSettings: {
        AISummary: true,
        JiraTickets: 5,
        SlackMessages: 5,
        GitHubPRs: 5,
        NotionPages: 5,
        LinearTickets: 5,
        ConfluenceDocs: 5,
      },
    });
  });
});
