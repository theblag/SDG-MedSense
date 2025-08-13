import React from 'react'
import DownloadButton from '@/components/downloadButton'
import { PulsatingButton } from "@/components/magicui/pulsating-button";

const Testpage = () => {
  return (
    <div className="bg-gray-900 min-h-screen p-6"> {/* Add a dark background to container */}
      <div className="w-full flex items-center justify-center">
        <div className="w-[90%] text-left mx-auto space-y-8 text-white">

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-[2.5rem] whitespace-nowrap font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Installation Steps for Chrome Extension
            </h1>
            <p className="text-[0.9rem] text-gray-300 font-medium">
              Step-by-step guide to download, extract, and load a custom Chrome extension.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-300 text-[1rem] leading-relaxed"> {/* lighter gray */}
              Follow these steps carefully to ensure your extension installs correctly and functions as expected.
            </p>
          </div>

          {/* Step-by-step Instructions */}
          <div className="space-y-6">

            <div>
              <h2 className="font-semibold text-white text-lg">1. Download the .zip File</h2>
              <p className="text-gray-300 text-[1rem] leading-relaxed">
                Click the download link from your friend and save the .zip file to an easy-to-find location (e.g., Desktop or Downloads).
              </p>
              <DownloadButton />
            </div>

            <div>
              <h2 className="font-semibold text-white text-lg">2. Extract the .zip File</h2>
              <p className="text-gray-300 text-[1rem] leading-relaxed">
                Locate the .zip file, right-click, and select "Extract All" (Windows) or "Open With &gt; Archive Utility" (macOS).
                Extract to a known folder containing files like <code className="bg-gray-800 p-1 rounded">manifest.json</code> and scripts.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white text-lg">3. Open Chrome Extensions Page (Developer Mode)</h2>
              <p className="text-gray-300 text-[1rem] leading-relaxed">
                Open Chrome and navigate to <code className="bg-gray-800 p-1 rounded">chrome://extensions</code>. Enable <strong>Developer mode</strong> using the toggle at the top right.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white text-lg">4. Load the Unpacked Extension</h2>
              <p className="text-gray-300 text-[1rem] leading-relaxed">
                Click “<strong>Load unpacked</strong>” and select the extracted folder from step 2. The extension will be added and activated.
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-white text-lg">5. Confirm Installation & Test</h2>
              <p className="text-gray-300 text-[1rem] leading-relaxed">
                The extension should now be listed and may display an icon in your browser toolbar. Test its features as needed.
              </p>
            </div>

            {/* Notes Section */}
            <div className="space-y-2 pt-6 border-t border-gray-700">
              <h3 className="font-semibold text-white text-md">Notes:</h3>
              <ul className="list-disc list-inside text-gray-400 text-[0.9rem]">
                <li>Ensure you select the extracted folder, not the zipped file, to avoid errors.</li>
                <li>Only install extensions from trusted sources as they have full browser access.</li>
                <li>If updating the extension later, remove the old version before loading the new one.</li>
              </ul>
            </div>

          </div>

          {/* Call to Action / Summary */}
          <div className="pt-6">
            <p className="text-sm text-gray-500 italic">
              Download → Extract → Enable Developer Mode → Load unpacked folder → Enjoy your extension!
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Testpage
