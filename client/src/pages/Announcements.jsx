import { useQuery, useMutation } from "@apollo/client";
import { GET_ANNOUNCEMENTS } from "../utils/queries";
import { DELETE_ANNOUNCEMENT } from "../utils/mutations";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import AnnouncementCard from "../components/AnnouncementCard";

const Announcements = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_ANNOUNCEMENTS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [deleteAnnouncement, { loading: deleteLoading }] =
    useMutation(DELETE_ANNOUNCEMENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = Auth.loggedIn() ? Auth.getProfile() : { id: null };

  const handleDelete = async (announcementId) => {
    try {
      const { data } = await deleteAnnouncement({
        variables: { deleteAnnouncementId: announcementId },
      });

      if (data?.deleteAnnouncement) {
        refetch();
        navigate("/a");
        console.log("Announcement deleted successfully");
      } else {
        console.log("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleCreateAnnouncement = () => {
    navigate("/newannouncement");
  };

  return (
    <>
      <div id="announcements">
        <h1>Announcements</h1>
        <h4>
          Welcome to the Announcements page — your hub for the latest updates,
          opportunities, and community highlights. Whether it's upcoming
          workshops, international collaborations, open calls, or news from our
          network of artist, designers, educators, and researchers. We encourage
          you to check back often, contribute, and stay connected as we continue
          shaping a more inclusive and sustainable future together.
        </h4>

        <div className="separatingLine"></div>
        {user.id == null ? (
          <div className="create-announcement-button"></div>
        ) : (
          <div className="create-announcement-button">
            <button onClick={handleCreateAnnouncement}>NEW ANNOUNCEMENT</button>
          </div>
        )}
        <div className="announcement-container">
          {data?.getAnnouncements
            .filter((announcement) => announcement.isActive)
            .sort((a, b) => {
              const dateA = parseInt(a.expiryDate) || 0;
              const dateB = parseInt(b.expiryDate) || 0;
              return dateB - dateA; // Descending order (newest expiry dates first)
            })
            .map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                userId={user.id}
                onDelete={handleDelete}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Announcements;
