import { toRecords } from "./handler"; // Make sure to export the `toRecords` function in the original file.
import handler from "./handler";
import Airtable from "airtable";

jest.mock("airtable");

describe("toRecords", () => {
  it("should convert an array of dailyStats to an array of Airtable records", () => {
    const sampleData = [
      {
        statisticDate: "2023-01-01",
        counts: {
          webPageViews: 100,
          installCount: 10,
          uninstallCount: 5,
          averageRating: 4.2,
          webDownloadCount: 20,
        },
      },
    ];

    const expectedRecords = [
      {
        fields: {
          Date: "2023-01-01",
          "Web-PageViews": 100,
          InstallCount: 10,
          UninstallCount: 5,
          AverageRating: 4.2,
          "Web-DownloadCount": 20,
        },
      },
    ];

    expect(toRecords(sampleData)).toEqual(expectedRecords);
  });
});

describe("handler", () => {
  const mockCreate = jest.fn();
  const mockBase = jest.fn(() => ({ create: mockCreate }));

  beforeEach(() => {
    jest.clearAllMocks();
    (Airtable as jest.Mocked<typeof Airtable>).base.mockImplementation(
      mockBase
    );
  });

  it("should create records for dailyStats with length less than 10", async () => {
    const sampleReq = {
      body: {
        dailyStats: [
          /*... your sample data ...*/
        ],
      },
    };
    const sampleRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(sampleReq as any, sampleRes as any);

    expect(mockBase).toHaveBeenCalledWith("appDpKitgxjDIUwZ3");
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(sampleRes.status).toHaveBeenCalledWith(200);
    expect(sampleRes.json).toHaveBeenCalled();
  });

  it("should create records for dailyStats with length greater than or equal to 10", async () => {
    const sampleReq = {
      body: {
        dailyStats: [
          /*... your sample data with at least 10 items ...*/
        ],
      },
    };
    const sampleRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(sampleReq as any, sampleRes as any);

    expect(mockBase).toHaveBeenCalledWith("appDpKitgxjDIUwZ3");
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(sampleRes.status).toHaveBeenCalledWith(200);
    expect(sampleRes.json).toHaveBeenCalled();
  });
});
