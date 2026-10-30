update public.books as b
set cover = c.cover
from (
  values
    ('1984', 'George Orwell', 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg'),
    ('Things Fall Apart', 'Chinua Achebe', 'https://covers.openlibrary.org/b/id/12816943-L.jpg'),
    ('Ficciones', 'Jorge Luis Borges', 'https://covers.openlibrary.org/b/id/15188882-L.jpg'),
    ('Klara and the Sun', 'Kazuo Ishiguro', 'https://covers.openlibrary.org/b/id/10648686-L.jpg'),
    ('Chronicle of a Death Foretold', 'Gabriel García Márquez', 'https://covers.openlibrary.org/b/id/12198662-L.jpg'),
    ('The Kite Runner', 'Khaled Hosseini', 'https://covers.openlibrary.org/b/id/14846827-L.jpg'),
    ('Flatland', 'Edwin A. Abbott', 'https://covers.openlibrary.org/b/id/49411-L.jpg'),
    ('Crime and Punishment', 'Fyodor Dostoevsky', 'https://covers.openlibrary.org/b/id/15183762-L.jpg'),
    ('Pachinko', 'Min Jin Lee', 'https://covers.openlibrary.org/b/id/8044605-L.jpg'),
    ('The Three-Body Problem', 'Liu Cixin', 'https://covers.openlibrary.org/b/isbn/9780765382030-L.jpg'),
    ('Kokoro', 'Natsume Soseki', 'https://covers.openlibrary.org/b/id/12197397-L.jpg'),
    ('Why Nations Fail', 'Acemoglu & Robinson', 'https://covers.openlibrary.org/b/id/7253519-L.jpg'),
    ('Laut Bercerita', 'Leila S. Chudori', 'https://covers.openlibrary.org/b/id/10648285-L.jpg'),
    ('Seporsi Mie Ayam Sebelum Mati', 'Brian Khrisna', 'https://covers.openlibrary.org/b/id/15268683-L.jpg'),
    ('Perahu Kertas', 'Dee Lestari', '/covers/perahu-kertas.jpg'),
    ('Supernova: Ksatria, Puteri, dan Bintang Jatuh', 'Dee Lestari', '/covers/supernova-ksatria.jpg'),
    ('Supernova: Akar', 'Dee Lestari', '/covers/supernova-akar.jpg'),
    ('Supernova: Petir', 'Dee Lestari', '/covers/supernova-petir.jpg'),
    ('Supernova: Partikel', 'Dee Lestari', '/covers/supernova-partikel.jpg'),
    ('Supernova: Gelombang', 'Dee Lestari', '/covers/supernova-gelombang.jpg'),
    ('Supernova: Inteligensi Embun Pagi', 'Dee Lestari', '/covers/supernova-inteligensi.jpg'),
    ('Bumi', 'Tere Liye', 'https://covers.openlibrary.org/b/id/12810708-L.jpg'),
    ('Bulan', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14640031-L.jpg'),
    ('Matahari', 'Tere Liye', 'https://covers.openlibrary.org/b/id/10956534-L.jpg'),
    ('Negeri Para Bedebah', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14829675-L.jpg'),
    ('Negeri di Ujung Tanduk', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14541749-L.jpg'),
    ('Pulang', 'Tere Liye', 'https://covers.openlibrary.org/b/id/12905869-L.jpg'),
    ('Pergi', 'Tere Liye', 'https://covers.openlibrary.org/b/id/12905873-L.jpg'),
    ('Pulang-Pergi', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14541785-L.jpg'),
    ('Bedebah di Ujung Tanduk', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14541795-L.jpg'),
    ('Tanah Para Bandit', 'Tere Liye', 'https://covers.openlibrary.org/b/id/14542361-L.jpg'),
    ('Bandit-Bandit Berkelas', 'Tere Liye', 'https://covers.openlibrary.org/b/id/15089573-L.jpg'),
    ('Drunken Monster', 'Pidi Baiq', '/covers/drunken-monster.jpg'),
    ('Drunken Molen', 'Pidi Baiq', '/covers/drunken-molen.jpg'),
    ('Drunken Mama', 'Pidi Baiq', '/covers/drunken-mama.jpg'),
    ('Drunken Marmut', 'Pidi Baiq', '/covers/drunken-marmut.jpg')
) as c(title, author, cover)
where b.title = c.title
  and b.author = c.author
  and coalesce(b.cover, '') = '';
