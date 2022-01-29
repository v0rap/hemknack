import libtorrent


class TorrentHandler:
    def __init__(self):
        # TODO: Implement session loading from file
        self.lt_session = libtorrent.session({
            "listen_interfaces": "0.0.0.0:6811"
        })

    def parse_magnet_uri(self):
        libtorrent.parse_magnet_uri(
            "magnet:?xt=urn:btih:f4410138219e477435ce50a3205ac04a4de87b8a&dn=Superhost.2021.1080p.BluRay.x264.DTS-MT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2930&tr=udp%3A%2F%2F9.rarbg.to%3A2910&tr=udp%3A%2F%2Ftracker.fatkhoala.org%3A13780&tr=udp%3A%2F%2Ftracker.slowcheetah.org%3A14770"
        )

t = TorrentHandler()
t.parse_magnet_uri()
