// Mock CDN images
const mockImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1520975918318-3e3c7c4b3f4b?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=742&h=960&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/247322/pexels-photo-247322.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/34950/pexels-photo.jpg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225519/pexels-photo-3225519.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225520/pexels-photo-3225520.jpeg?w=742&h=960&fit=crop",
    "https://images.pexels.com/photos/3225521/pexels-photo-3225521.jpeg?w=742&h=960&fit=crop",

    // ... more images
];

// Mock profile data
const mockProfile = {
    handle: '@creator',
    links: {
        instagram: 'https://instagram.com/creator',
        tiktok: 'https://tiktok.com/@creator',
        youtube: 'https://youtube.com/@creator',
        whatsapp: 'https://wa.me/1234567890',
        linkedin: 'https://linkedin.com/in/creator'
    }
};

// Generate random mock cards
function generateMockCards(count = 80) {
    return Array.from({ length: count }, (_, i) => ({
        uid: `card-${i}`,
        imageUrl: mockImages[i % mockImages.length],
        title: `Sample Card Title ${i + 1} with some extra text to test line clamping`,
        targetUrl: 'https://example.com',
        source: i % 2 === 0 ? 'ig' : 'tt',
        pinned: i < 6 // First 6 cards are pinned
    }));
}

// Mock API calls
export async function getPublicProfile() {
    console.log('Fetching public profile...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProfile;
}

export async function getPublicCards() {
    console.log('Fetching cards...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const cards = generateMockCards();
    console.log(`Generated ${cards.length} mock cards`);
    return cards;
}
