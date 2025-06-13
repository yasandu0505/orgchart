import '../../src/index.css';


export default function Home() {
   const onExplore = () => {
    // your logic here
    console.log('Explore clicked');
  };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 p-6">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Your Government Hierarchy
        </h1>

        <p className="text-lg text-gray-600">
          Your Government <span className="mx-1">→</span>
          Your Ministry <span className="mx-1">→</span>
          Your Department
        </p>

        <p className="text-md text-gray-500">
          Ever wondered how everything connects?
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onExplore}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Explore Structure
          </button>
          <a
            href="https://yourcompanysite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Visit Our Site
          </a>
        </div>
      </div>
    </div>
    );
}