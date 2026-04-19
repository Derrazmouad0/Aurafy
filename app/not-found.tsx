export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-4xl font-bold text-purple-500 mb-4">404 - Page Introuvable</h2>
      <p className="text-gray-400 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
      <a 
        href="/" 
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all"
      >
        Retour à l'accueil
      </a>
    </div>
  );
}