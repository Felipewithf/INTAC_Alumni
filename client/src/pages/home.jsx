const Home = () => {
  // Hardcoded artist data
  const featuredArtists = [
    {
      id: 1,
      name: "Niina Kiiveri",
      image: "/niina.png", // Replace with actual image path
      pieceName: "My Life as an Imaginary Horse",
      description: "Draw the line between a horse girl and their horse. In this series of work I seek an answer to how it looks when you dream about something so strongly that it comes true. What happens when you lose yourself in dreaming of horses that you almost become one.",
      artworkMedium: "Digital photography",
      videoLink: "",
      credits: ""
    },
    {
      id: 2,
      name: "Svny2",
        image: "/svny2.png",
        pieceName: "Digital Disguises",
      description: "Today, where our interactions predominantly occur online, the need to maintain anonymity and protect our identity has become more prevalent. However, adopting alternative personas can lead to deceptive & manipulative behaviour. Alike the popular TV show Scooby Doo, we are prompted to reflect on the hidden motives behind the disguises, especially in the digital world.",
      artworkMedium: "PNG images encoded in HTML document.",
      videoLink: "",
      credits: ""
    },
    {
      id: 3,
      name: "Luiza Preda",
      image: "/luiza.png",
      pieceName: "Light Studies",
      description: "This photographic series transforms nature into a field of color and emotion. Using deliberate blur, the camera becomes a painter’s brush—turning nature into abstract studies of perception. The approach draws from the legacies of plein-air painting and color theory, echoing the experiments of artists such as J.M.W. Turner, Claude Monet, and later the Color Field painters, who sought to capture light as an emotional and sensory experience. In this series, light and color function as both subject and language—exploring how perception, mood, and atmosphere intertwine in the act of seeing.",
      artworkMedium: "Digital Photography",
      videoLink: "",
      credits: ""
    },
    {
      id: 4,
      name: "Niko Skorpio",
      image: "/niko.png",
      pieceName: "At the Heart of It All, Quantum Foam 1, Unnamed 250724",
      description: "Brief selection from an ongoing series of abstract line-based acrylic/ink/mixed-media works from the grey area where mind and matter converge.",
      artworkMedium: "Acrylic on canvas, and acrylic on board",
      videoLink: "",
      credits: ""
    },
    {
      id: 5,
      name: "Theo Yau",
      image: "/theo.png",
      pieceName: "Dinosaur Still Life, Full Belly, Red-Eared Slider Family, Self-Portrait, Horse With Boots",
      description: "I spent 2025 considering identity, desires, and my relationship with others, first through animals but ultimately culminating in my mixed media self-portrait. To connect with others, we can sometimes feel the need to reduce the richness of our identities down into something easy for others to read. I envied the freedom that animals seem to have, not needing to label themselves and adhere to those roles strictly. I felt like an animal confined by those human expectations; like a rocking horse with the means to run free, if only it could abandon the rockers keeping it in place. Slowly, I find the strength to free myself.",
      artworkMedium: "Acrylic on canvas, and fabric",
      videoLink: "",
      credits: ""
    },
    {
      id: 6,
      name: "Peter Sramek",
      image: "/peter.png",
      pieceName: "We need a Promise",
      description: "Promise is a project about hope. Hope that if we can understand how critically our existence is linked with other lifeforms on the planet, we may be able to alter our current human trajectory. We can lament, but in reality we must change as a species and make a promise to protect the earth’s ecosystems from ourselves. A deeper connection to other lifeforms may help. Whales have been on the earth for millennia. Observed in their ocean home, one is reminded of the insignificance of human time. We crawl on the surface, tinkering with our technologies, a tiny blink in geological terms. It is just possible they will still be here, traversing the oceans, when humanity has destroyed itself. Maybe experiencing these beings can inspire us to action, to make amends. Download the Artivive application to a phone and view the collages to play 6 videos.",
      artworkMedium: "Photo collage with Artivive augmented reality video",
      videoLink: "",
      credits: "Peter Sramek and Franco Lapache"
    },
    {
      id: 7,
      name: "Turru",
      image: "/turru.png",
      pieceName: "RAINBOWLAND San Luis Potosi Queer, and FEMME",
      description: "This experimental documentary explores the queer community in San Luis Potosí through a hybrid structure that blends collective testimony with personal, literary reflection. The film is built around interviews with queer people from the region, who share their lived experiences, social contexts, and emotional landscapes, revealing the complexities of visibility, identity, and resistance in a conservative environment. These voices form a living archive of queer presence in the city. Interwoven with these testimonies is a narrative, literary layer drawn from fragments of a queer fantasy novel I wrote at the age of 20. This poetic voice reflects my own experience as a queer person, functioning as an inner monologue that moves between memory, desire, and imagination. By juxtaposing documentary realism with fictional and symbolic elements, the film challenges traditional documentary forms and proposes a more intimate, subjective way of understanding queer life, one that exists between reality and fantasy, the personal and the collective.",
      artworkMedium: "Documentary film",
      videoLink: "https://youtu.be/yU73n2QM8zs?si=6_4UTmW35BR8a2f9",
      credits: ""
    },
    {
      id: 8,
      name: "Virginia Gail Smith",
      image: "/virginia.png",
      pieceName: "Assemblages",
      description: "Sustainability has reshaped my practice, drawing me toward a gentler, more contemplative way of making—one where tenderness becomes a method, and attention becomes a form of care. Each work is a small, breathing vignette: a moment where human intention meets the quiet insistence of the natural world. In these encounters, I follow intuition, letting materials gather themselves into stories of reciprocity, vulnerability, and the subtle negotiations between control and surrender. My forms echo the biomorphic languages of Joan Miró, Hans Arp, Paul Klee, and Barbara Hepworth—artists who listened closely to the rhythms and patterns that arise in nature. Their influence lingers as a kind of kinship, a shared fascination with organic shapes, intricate structures, and the mysteries held within them. I work within that lineage, guided by the intimate pull of natural forms and the sense that each gesture can open a small doorway into wonder.",
      artworkMedium: "Assemblages",
      videoLink: "",
      credits: ""
    },
    {
      id: 9,
      name: "Brisa Quevedo",
      image: "/brisa.png",
      pieceName: "Los trabajos invisibles",
      description: "In Mexico, you see people trying to survive on every corner; thousands of families depend on street vending for their livelihood, but these are stories that go unspoken and seem to disappear. For street vendors, public space is where they become visible, where their voices, their bodies, and their merchandise exist. From experience, reality, and fear, 'The Invisible Jobs' was born—an art installation that portrays the work of street vendors in Zitácuaro, Michoacán, Mexico, through a visual and auditory narrative. The work brings together photographic portraits, personal stories, objects from the street environment, urban soundscapes, and a digital map hosted on a web platform. From these elements, a space is constructed that invites us to pause, to listen, and to look again, recognizing the personal memories of those who inhabit the city informally and whose presence is fundamental to understanding urban life.",
      artworkMedium: "Audiovisual installation",
      videoLink: "",
      credits: ""
    },
  ];

  // YouTube video ID - replace with actual video ID
  const youtubeVideoId = "3JqS28Monys"; // Replace with your actual video ID

  return (
    <div id="home">
      {/* YouTube Video Section */}
      <div className="home-video-container">
        <iframe
          className="home-youtube-video"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="Alum Retrospective 2024-2025"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Main Title */}
      <div className="home-title-container">
        <h1 className="home-main-title">ALUM RETROSPECTIVE 2024-2025</h1>
      </div>

      {/* Featured Artists Cards */}
      <div className="home-artists-container">
        {featuredArtists.map((artist) => (
          <div key={artist.id} className="home-artist-card">
            <div className="home-artist-card-header">
              <h3 className="home-artist-name">{artist.name}</h3>
            </div>
            <div className="home-artist-image-container">
              <img
                src={`/home/${artist.image}`}
                alt={artist.name}
                className="home-artist-image"
              />
            </div>
            <div className="home-artist-content">
              <h4 className="home-artist-piece-name">{artist.pieceName}</h4>
              <p className="home-artist-description">{artist.description}</p>
              <div className="home-artist-footnotes">
                <p className="home-artist-medium">
                  <strong>Original artwork medium:</strong> {artist.artworkMedium}
                </p>
                {artist.credits && artist.credits.trim() !== "" && (
                  <p className="home-artist-medium">
                    <strong>Credits:</strong> {artist.credits}
                  </p>
                )}
                {artist.videoLink && artist.videoLink.trim() !== "" && (
                  <div className="home-artist-video-link-container">
                    <a
                      href={artist.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-artist-video-link"
                    >
                      Link to Complete Video
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
