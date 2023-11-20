"use client";
import Image from "next/image";

export default function Header({ userEmail, userToken }) {
  return (
    <div className="Header d-flex flex-items-center flex-justify-between">
      <a href="/" className="Header-link">
        <div className="Header-item">
          <Image
            src="/logos/watermelon.png"
            alt="Watermelon Tools"
            width="36"
            height="23"
          />
        </div>
      </a>
      <div className="Header-item mr-0">
        <div>
          <details className="dropdown relative">
            <summary className="btn cursor-pointer px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-gray-200 transition-colors duration-200">
              {userEmail}
              <div className="dropdown-caret ml-2 w-4 h-4"></div>
            </summary>

            <ul className="dropdown-menu dropdown-menu-sw mt-2 w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
              <li>
                <a
                  className="dropdown-item block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  href="https://github.com/apps/watermelon-context"
                >
                  GitHub App
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  href={`https://docs.watermelontools.com/`}
                >
                  API Docs
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  href={`https://app.watermelontools.com/settings`}
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  href={`https://discord.com/invite/H4AE6b9442`}
                >
                  Get Help
                </a>
              </li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
