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
    ('Why Nations Fail', 'Acemoglu & Robinson', 'https://covers.openlibrary.org/b/id/7253519-L.jpg')
) as c(title, author, cover)
where b.title = c.title
  and b.author = c.author
  and coalesce(b.cover, '') = '';
