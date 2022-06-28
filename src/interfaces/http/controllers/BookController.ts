import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response, httpPost, httpPut } from 'inversify-express-utils';

import { CreateBookCommand } from '@commands/book/CreateBook';
import { UpdateBookAuthorCommand } from '@commands/book/UpdateBookAuthor';
import { UpdateBookDescriptionCommand } from '@commands/book/UpdateBookDescription';
import { UpdateBookImageCommand } from '@commands/book/UpdateBookImage';
import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/commandBus';

import { IBookReadModelFacade } from '../../../application/projection/book/ReadModel';
import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/books', verifyJWT_MW)
export class BookController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade
  ) {}

  @httpGet('/')
  async getAllBooks(@request() req: Request, @response() res: Response) {
    console.log(req.query);
    const query = req.query || {};
    const name = query.name || '';
    if (name) {
      const books = await this.readmodel.getByName(name.toString());
      return res.json(ok('Successfully retrieved all books', books));
    } else {
      const books = await this.readmodel.getAll();
      return res.json(ok('Successfully retrieved all books', books));
    }
  }

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const book = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the book', book));
  }

  @httpPost('/')
  async createBook(@request() req: Request, @response() res: Response) {
    const { name, description, image, authorId, price } = req.body;
    const command = new CreateBookCommand(name, description, image, authorId, price);
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the book', undefined));
  }

  @httpPut('/:guid/author')
  async updateAuthor(@request() req: Request, @response() res: Response) {
    const { authorId, version } = req.body;
    const command = new UpdateBookAuthorCommand(req.params.guid, authorId, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:guid/description')
  async updateDescription(@request() req: Request, @response() res: Response) {
    const { description, version } = req.body;
    const command = new UpdateBookDescriptionCommand(req.params.guid, description, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:guid/image')
  async updateImage(@request() req: Request, @response() res: Response) {
    const { image, version } = req.body;
    const command = new UpdateBookImageCommand(req.params.guid, image, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpGet('/batch/batch')
  async getBatch(@request() req: Request, @response() res: Response) {
    const books = {
      count: 3827,
      next: 'https://gutendex.com/books/?page=2&topic=science',
      previous: null,
      results: [
        {
          id: 84,
          title: 'Frankenstein; Or, The Modern Prometheus',
          authors: [
            {
              name: 'Shelley, Mary Wollstonecraft',
              birth_year: 1797,
              death_year: 1851,
            },
          ],
          translators: [],
          subjects: [
            'Frankensteins monster (Fictitious character) -- Fiction',
            'Frankenstein, Victor (Fictitious character) -- Fiction',
            'Gothic fiction',
            'Horror tales',
            'Monsters -- Fiction',
            'Science fiction',
            'Scientists -- Fiction',
          ],
          bookshelves: ['Gothic Fiction', 'Movie Books', 'Precursors of Science Fiction', 'Science Fiction by Women'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/84/84-0.txt',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/84.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/84.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/84.kindle.images',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/84/84-h/84-h.htm',
            'text/html': 'https://www.gutenberg.org/ebooks/84.html.images',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg',
          },
          download_count: 45117,
        },
        {
          id: 43,
          title: 'The Strange Case of Dr. Jekyll and Mr. Hyde',
          authors: [
            {
              name: 'Stevenson, Robert Louis',
              birth_year: 1850,
              death_year: 1894,
            },
          ],
          translators: [],
          subjects: [
            'Horror tales',
            'London (England) -- Fiction',
            'Multiple personality -- Fiction',
            'Physicians -- Fiction',
            'Psychological fiction',
            'Science fiction',
            'Self-experimentation in medicine -- Fiction',
          ],
          bookshelves: ['Horror', 'Movie Books', 'Precursors of Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/zip': 'https://www.gutenberg.org/files/43/43-h.zip',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/43/43-h/43-h.htm',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/43.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/43.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/43.kindle.images',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/43/pg43.cover.medium.jpg',
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/43/43-0.txt',
            'text/html': 'https://www.gutenberg.org/ebooks/43.html.images',
          },
          download_count: 14856,
        },
        {
          id: 1232,
          title: 'The Prince',
          authors: [
            {
              name: 'Machiavelli, Niccolò',
              birth_year: 1469,
              death_year: 1527,
            },
          ],
          translators: [
            {
              name: 'Marriott, W. K. (William Kenaz)',
              birth_year: null,
              death_year: 1927,
            },
          ],
          subjects: [
            'Political ethics -- Early works to 1800',
            'Political science -- Philosophy -- Early works to 1800',
            'State, The -- Early works to 1800',
          ],
          bookshelves: ['Banned Books from Anne Haights list', 'Harvard Classics', 'Philosophy', 'Politics'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/1232.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/1232.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/1232.rdf',
            'text/html; charset=us-ascii': 'https://www.gutenberg.org/files/1232/1232-h.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg',
            'text/html': 'https://www.gutenberg.org/ebooks/1232.html.images',
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/1232/1232-0.txt',
          },
          download_count: 10245,
        },
        {
          id: 35,
          title: 'The Time Machine',
          authors: [
            {
              name: 'Wells, H. G. (Herbert George)',
              birth_year: 1866,
              death_year: 1946,
            },
          ],
          translators: [],
          subjects: ['Dystopias -- Fiction', 'Science fiction', 'Time travel -- Fiction'],
          bookshelves: ['Movie Books', 'Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/35/pg35.cover.medium.jpg',
            'application/zip': 'https://www.gutenberg.org/files/35/35-0.zip',
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/35/35-0.txt',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/35.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/35.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/35.kindle.images',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/35/35-h/35-h.htm',
            'text/html': 'https://www.gutenberg.org/ebooks/35.html.images',
          },
          download_count: 7284,
        },
        {
          id: 36,
          title: 'The War of the Worlds',
          authors: [
            {
              name: 'Wells, H. G. (Herbert George)',
              birth_year: 1866,
              death_year: 1946,
            },
          ],
          translators: [],
          subjects: [
            'Imaginary wars and battles -- Fiction',
            'Life on other planets -- Fiction',
            'Mars (Planet) -- Fiction',
            'Martians -- Fiction',
            'Science fiction',
            'Space warfare -- Fiction',
            'War stories',
          ],
          bookshelves: ['Movie Books', 'Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/36/pg36.cover.medium.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/36/36-h.zip',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/36.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/36.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/36.kindle.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/36.txt.utf-8',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/36/36-0.txt',
            'text/html': 'https://www.gutenberg.org/files/36/36-h/36-h.htm',
          },
          download_count: 6405,
        },
        {
          id: 1497,
          title: 'The Republic',
          authors: [
            {
              name: 'Plato',
              birth_year: -428,
              death_year: -348,
            },
          ],
          translators: [
            {
              name: 'Jowett, Benjamin',
              birth_year: 1817,
              death_year: 1893,
            },
          ],
          subjects: [
            'Classical literature',
            'Justice -- Early works to 1800',
            'Political science -- Early works to 1800',
            'Utopias -- Early works to 1800',
          ],
          bookshelves: ['Philosophy'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain': 'https://www.gutenberg.org/ebooks/1497.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/1497.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/1497.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/1497.rdf',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/1497/1497-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/1497/pg1497.cover.small.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/1497/1497-0.zip',
            'application/zip': 'https://www.gutenberg.org/files/1497/1497-h.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/1497.html.images',
          },
          download_count: 6137,
        },
        {
          id: 1250,
          title: 'Anthem',
          authors: [
            {
              name: 'Rand, Ayn',
              birth_year: 1905,
              death_year: 1982,
            },
          ],
          translators: [],
          subjects: [
            'Individuality -- Fiction',
            'Love stories',
            'Men -- Psychology -- Fiction',
            'Psychological fiction',
            'Science fiction',
            'Time travel -- Fiction',
          ],
          bookshelves: ['Science Fiction', 'Science Fiction by Women'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/1250/1250-0.txt',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/1250.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/1250.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/1250.rdf',
            'application/zip': 'https://www.gutenberg.org/files/1250/1250-0.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/1250/pg1250.cover.small.jpg',
            'text/html': 'https://www.gutenberg.org/ebooks/1250.html.images',
            'text/html; charset=us-ascii': 'https://www.gutenberg.org/files/1250/1250-h/1250-h.htm',
          },
          download_count: 6076,
        },
        {
          id: 3207,
          title: 'Leviathan',
          authors: [
            {
              name: 'Hobbes, Thomas',
              birth_year: 1588,
              death_year: 1679,
            },
          ],
          translators: [],
          subjects: ['Political science -- Early works to 1800', 'State, The -- Early works to 1800'],
          bookshelves: ['Harvard Classics', 'Politics'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/3207/3207-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/3207/pg3207.cover.small.jpg',
            'application/zip': 'https://www.gutenberg.org/files/3207/3207-0.zip',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/3207.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/3207.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/3207.rdf',
            'text/html': 'https://www.gutenberg.org/ebooks/3207.html.images',
            'text/html; charset=us-ascii': 'https://www.gutenberg.org/files/3207/3207-h.zip',
          },
          download_count: 5507,
        },
        {
          id: 7370,
          title: 'Second Treatise of Government',
          authors: [
            {
              name: 'Locke, John',
              birth_year: 1632,
              death_year: 1704,
            },
          ],
          translators: [],
          subjects: [
            'Liberty -- Early works to 1800',
            'Political science -- Early works to 1800',
            'Toleration -- Early works to 1800',
          ],
          bookshelves: ['Philosophy', 'Politics'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/html': 'https://www.gutenberg.org/ebooks/7370.html.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/7370.txt.utf-8',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/7370.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/7370.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/7370.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/7370/7370-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/7370/pg7370.cover.small.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/7370/7370-h.zip',
            'application/zip': 'https://www.gutenberg.org/files/7370/7370-0.zip',
          },
          download_count: 4931,
        },
        {
          id: 132,
          title: 'The Art of War',
          authors: [
            {
              name: 'Sunzi, active 6th century B.C.',
              birth_year: null,
              death_year: null,
            },
          ],
          translators: [
            {
              name: 'Giles, Lionel',
              birth_year: 1875,
              death_year: 1958,
            },
          ],
          subjects: ['Military art and science -- Early works to 1800', 'War -- Early works to 1800'],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/zip': 'https://www.gutenberg.org/files/132/132-h.zip',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/132.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/132.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/132.kindle.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/132.txt.utf-8',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/132/132-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/132/pg132.cover.medium.jpg',
            'text/html': 'https://www.gutenberg.org/files/132/132-h/132-h.htm',
          },
          download_count: 3425,
        },
        {
          id: 147,
          title: 'Common Sense',
          authors: [
            {
              name: 'Paine, Thomas',
              birth_year: 1737,
              death_year: 1809,
            },
          ],
          translators: [],
          subjects: [
            'Monarchy -- Early works to 1800',
            'Political science -- Early works to 1800',
            'United States -- Politics and government -- 1775-1783',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/147.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/147.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/147.kindle.images',
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/147/147-h/147-h.htm',
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/147/147-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/147/pg147.cover.small.jpg',
            'text/html': 'https://www.gutenberg.org/ebooks/147.html.images',
          },
          download_count: 3224,
        },
        {
          id: 164,
          title: 'Twenty Thousand Leagues under the Sea',
          authors: [
            {
              name: 'Verne, Jules',
              birth_year: 1828,
              death_year: 1905,
            },
          ],
          translators: [],
          subjects: [
            'Adventure stories',
            'Science fiction',
            'Sea stories',
            'Submarines (Ships) -- Fiction',
            'Underwater exploration -- Fiction',
          ],
          bookshelves: ['Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/164/pg164.cover.medium.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/164/164-0.zip',
            'application/zip': 'https://www.gutenberg.org/files/164/164-h.zip',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/164.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/164.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/164.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/164.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/164/164-0.txt',
            'text/html': 'https://www.gutenberg.org/files/164/164-h/164-h.htm',
          },
          download_count: 2696,
        },
        {
          id: 21279,
          title: '2 B R 0 2 B',
          authors: [
            {
              name: 'Vonnegut, Kurt',
              birth_year: 1922,
              death_year: 2007,
            },
          ],
          translators: [],
          subjects: ['Science fiction', 'Short stories'],
          bookshelves: ['Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/21279/21279.txt',
            'application/zip': 'https://www.gutenberg.org/files/21279/21279.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/21279.html.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/21279.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/21279.txt.utf-8',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/21279.epub.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/21279.kindle.images',
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/21279/21279-h.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/21279/pg21279.cover.small.jpg',
          },
          download_count: 2317,
        },
        {
          id: 159,
          title: 'The Island of Doctor Moreau',
          authors: [
            {
              name: 'Wells, H. G. (Herbert George)',
              birth_year: 1866,
              death_year: 1946,
            },
          ],
          translators: [],
          subjects: [
            'Animal experimentation -- Fiction',
            'Islands -- Fiction',
            'Science fiction',
            'Shipwreck survival -- Fiction',
          ],
          bookshelves: ['Best Books Ever Listings', 'Movie Books', 'Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/159.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/159.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/159.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/159.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/159/159-0.txt',
            'text/html': 'https://www.gutenberg.org/files/159/159-h/159-h.htm',
            'application/octet-stream': 'https://www.gutenberg.org/files/159/159-h.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/159/pg159.cover.medium.jpg',
          },
          download_count: 2172,
        },
        {
          id: 5230,
          title: 'The Invisible Man: A Grotesque Romance',
          authors: [
            {
              name: 'Wells, H. G. (Herbert George)',
              birth_year: 1866,
              death_year: 1946,
            },
          ],
          translators: [],
          subjects: ['Mentally ill -- Fiction', 'Psychological fiction', 'Science fiction', 'Scientists -- Fiction'],
          bookshelves: ['Movie Books'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/5230/pg5230.cover.medium.jpg',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/5230/5230-0.txt',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/5230.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/5230.epub.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/5230.kindle.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/5230.txt.utf-8',
            'application/octet-stream': 'https://www.gutenberg.org/files/5230/5230-0.zip',
            'text/html': 'https://www.gutenberg.org/files/5230/5230-h/5230-h.htm',
          },
          download_count: 1985,
        },
        {
          id: 1946,
          title: 'On War',
          authors: [
            {
              name: 'Clausewitz, Carl von',
              birth_year: 1780,
              death_year: 1831,
            },
          ],
          translators: [
            {
              name: 'Graham, J. J. (James John)',
              birth_year: null,
              death_year: null,
            },
          ],
          subjects: ['Military art and science', 'War'],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/1946/1946.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/1946/pg1946.cover.medium.jpg',
            'text/plain; charset=iso-8859-1': 'https://www.gutenberg.org/files/1946/1946-8.txt',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/1946.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/1946.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/1946.rdf',
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/1946/1946-0.zip',
            'application/zip': 'https://www.gutenberg.org/files/1946/1946.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/1946.html.images',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/1946/1946-h/1946-h.htm',
          },
          download_count: 1956,
        },
        {
          id: 61963,
          title: 'We',
          authors: [
            {
              name: 'Zamiatin, Evgenii Ivanovich',
              birth_year: 1884,
              death_year: 1937,
            },
          ],
          translators: [
            {
              name: 'Zilboorg, Gregory',
              birth_year: 1890,
              death_year: 1959,
            },
          ],
          subjects: [
            'Dystopias -- Fiction',
            'Russian fiction -- Translations into English',
            'Science fiction',
            'Totalitarianism -- Fiction',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/61963/pg61963.cover.medium.jpg',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/61963.epub.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/61963.kindle.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/61963.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/61963.txt.utf-8',
            'text/html': 'https://www.gutenberg.org/ebooks/61963.html.images',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/61963/61963-h/61963-h.htm',
            'application/zip': 'https://www.gutenberg.org/files/61963/61963-8.zip',
            'text/plain; charset=iso-8859-1': 'https://www.gutenberg.org/files/61963/61963-8.txt',
          },
          download_count: 1881,
        },
        {
          id: 68008,
          title: 'Venus Equilateral',
          authors: [
            {
              name: 'Smith, George O. (George Oliver)',
              birth_year: 1911,
              death_year: 1981,
            },
          ],
          translators: [],
          subjects: ['Inventions -- Fiction', 'Science fiction', 'Space stations -- Fiction', 'Technology -- Fiction'],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/68008/68008-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/68008/pg68008.cover.medium.jpg',
            'text/plain': 'https://www.gutenberg.org/ebooks/68008.txt.utf-8',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/68008.epub.images',
            'application/zip': 'https://www.gutenberg.org/files/68008/68008-h.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/68008.html.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/68008.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/68008.kindle.images',
          },
          download_count: 1858,
        },
        {
          id: 86,
          title: 'A Connecticut Yankee in King Arthurs Court',
          authors: [
            {
              name: 'Twain, Mark',
              birth_year: 1835,
              death_year: 1910,
            },
          ],
          translators: [],
          subjects: [
            'Americans -- Great Britain -- Fiction',
            'Arthurian romances -- Adaptations',
            'Britons -- Fiction',
            'Fantasy fiction',
            'Kings and rulers -- Fiction',
            'Knights and knighthood -- Fiction',
            'Satire',
            'Time travel -- Fiction',
          ],
          bookshelves: ['Arthurian Legends', 'Precursors of Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/zip': 'https://www.gutenberg.org/files/86/86-h.zip',
            'application/octet-stream': 'https://www.gutenberg.org/files/86/86-0.zip',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/86/86-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/86/pg86.cover.small.jpg',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/86.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/86.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/86.kindle.images',
            'text/html': 'https://www.gutenberg.org/ebooks/86.html.images',
          },
          download_count: 1834,
        },
        {
          id: 31979,
          title: 'The Tunnel Under the World',
          authors: [
            {
              name: 'Pohl, Frederik',
              birth_year: 1919,
              death_year: 2013,
            },
          ],
          translators: [],
          subjects: ['Science fiction'],
          bookshelves: ['Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/31979/31979-h/31979-h.htm',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/31979/pg31979.cover.small.jpg',
            'text/html': 'https://www.gutenberg.org/ebooks/31979.html.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/31979.kindle.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/31979.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/31979.epub.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/31979.txt.utf-8',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/31979/31979.txt',
          },
          download_count: 1796,
        },
        {
          id: 139,
          title: 'The Lost World',
          authors: [
            {
              name: 'Doyle, Arthur Conan',
              birth_year: 1859,
              death_year: 1930,
            },
          ],
          translators: [],
          subjects: [
            'Challenger, Professor (Fictitious character) -- Fiction',
            'Dinosaurs -- Fiction',
            'Fantasy fiction',
            'Prehistoric peoples -- Fiction',
            'South America -- Fiction',
          ],
          bookshelves: ['Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/139.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/139.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/139.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/139.kindle.images',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/139/pg139.cover.small.jpg',
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/139/139-h.zip',
            'application/zip': 'https://www.gutenberg.org/files/139/139.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/139.html.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/139/139.txt',
          },
          download_count: 1705,
        },
        {
          id: 68047,
          title: 'Off the Beam',
          authors: [
            {
              name: 'Smith, George O. (George Oliver)',
              birth_year: 1911,
              death_year: 1981,
            },
          ],
          translators: [],
          subjects: [
            'Communication -- Fiction',
            'Science fiction',
            'Space ships -- Fiction',
            'Space stations -- Fiction',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/68047/68047-0.txt',
            'application/octet-stream': 'https://www.gutenberg.org/files/68047/68047-0.zip',
            'text/html': 'https://www.gutenberg.org/files/68047/68047-h/68047-h.htm',
            'application/zip': 'https://www.gutenberg.org/files/68047/68047-h.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/68047/pg68047.cover.small.jpg',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/68047.epub.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/68047.kindle.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/68047.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/68047.txt.utf-8',
          },
          download_count: 1664,
        },
        {
          id: 42324,
          title: 'Frankenstein; Or, The Modern Prometheus',
          authors: [
            {
              name: 'Shelley, Mary Wollstonecraft',
              birth_year: 1797,
              death_year: 1851,
            },
          ],
          translators: [],
          subjects: [
            'Frankensteins monster (Fictitious character) -- Fiction',
            'Frankenstein, Victor (Fictitious character) -- Fiction',
            'Gothic fiction',
            'Horror tales',
            'Monsters -- Fiction',
            'Science fiction',
            'Scientists -- Fiction',
          ],
          bookshelves: ['Precursors of Science Fiction', 'Science Fiction by Women'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/42324.epub.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/42324.txt.utf-8',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/42324.rdf',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/42324.kindle.images',
            'text/plain; charset=iso-8859-1': 'https://www.gutenberg.org/files/42324/42324-8.zip',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/42324/42324.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/42324/pg42324.cover.medium.jpg',
            'text/html': 'https://www.gutenberg.org/ebooks/42324.html.images',
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/42324/42324-h/42324-h.htm',
            'application/zip': 'https://www.gutenberg.org/files/42324/42324-h.zip',
          },
          download_count: 1598,
        },
        {
          id: 18857,
          title: 'A Journey to the Centre of the Earth',
          authors: [
            {
              name: 'Verne, Jules',
              birth_year: 1828,
              death_year: 1905,
            },
          ],
          translators: [],
          subjects: [
            'Adventure stories',
            'Earth (Planet) -- Core -- Fiction',
            'Science fiction',
            'Voyages, Imaginary -- Fiction',
          ],
          bookshelves: ['Movie Books', 'Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=iso-8859-1': 'https://www.gutenberg.org/files/18857/18857-8.zip',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/18857/18857.txt',
            'text/html': 'https://www.gutenberg.org/ebooks/18857.html.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/18857.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/18857.epub.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/18857.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/18857.kindle.images',
            'text/html; charset=iso-8859-1': 'https://www.gutenberg.org/files/18857/18857-h/18857-h.htm',
            'application/zip': 'https://www.gutenberg.org/files/18857/18857.zip',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/18857/pg18857.cover.medium.jpg',
          },
          download_count: 1597,
        },
        {
          id: 17405,
          title: 'The Art of War',
          authors: [
            {
              name: 'Sunzi, active 6th century B.C.',
              birth_year: null,
              death_year: null,
            },
          ],
          translators: [
            {
              name: 'Giles, Lionel',
              birth_year: 1875,
              death_year: 1958,
            },
          ],
          subjects: ['Military art and science -- Early works to 1800', 'War -- Early works to 1800'],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/zip': 'https://www.gutenberg.org/files/17405/17405-0.zip',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/17405.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/17405.epub.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/17405.kindle.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/17405.txt.utf-8',
            'text/html': 'https://www.gutenberg.org/files/17405/17405-h/17405-h.htm',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/17405/pg17405.cover.medium.jpg',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/17405/17405-0.txt',
          },
          download_count: 1525,
        },
        {
          id: 62,
          title: 'A Princess of Mars',
          authors: [
            {
              name: 'Burroughs, Edgar Rice',
              birth_year: 1875,
              death_year: 1950,
            },
          ],
          translators: [],
          subjects: [
            'Carter, John (Fictitious character) -- Fiction',
            'Dejah Thoris (Fictitious character) -- Fiction',
            'Mars (Planet) -- Fiction',
            'Princesses -- Fiction',
            'Science fiction',
          ],
          bookshelves: ['Best Books Ever Listings', 'Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/62.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/62.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/62.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/62.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/62/62-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/62/pg62.cover.medium.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/62/62-0.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/62.html.images',
            'application/zip': 'https://www.gutenberg.org/files/62/62-h.zip',
          },
          download_count: 1392,
        },
        {
          id: 2488,
          title: 'Twenty Thousand Leagues Under the Seas: An Underwater Tour of the World',
          authors: [
            {
              name: 'Verne, Jules',
              birth_year: 1828,
              death_year: 1905,
            },
          ],
          translators: [
            {
              name: 'Walter, Frederick Paul',
              birth_year: 1943,
              death_year: null,
            },
          ],
          subjects: [
            'Adventure stories',
            'Science fiction',
            'Sea stories',
            'Submarines (Ships) -- Fiction',
            'Underwater exploration -- Fiction',
          ],
          bookshelves: ['Movie Books', 'Science Fiction'],
          languages: ['en'],
          copyright: true,
          media_type: 'Text',
          formats: {
            'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/2488/2488-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/2488/pg2488.cover.small.jpg',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/2488.kindle.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/2488.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/2488.epub.images',
            'text/html': 'https://www.gutenberg.org/ebooks/2488.html.images',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/2488/2488-h.zip',
            'application/zip': 'https://www.gutenberg.org/files/2488/2488-0.zip',
          },
          download_count: 1282,
        },
        {
          id: 68076,
          title: 'Trouble on Titan',
          authors: [
            {
              name: 'Kuttner, Henry',
              birth_year: 1915,
              death_year: 1958,
            },
          ],
          translators: [],
          subjects: [
            'Human-alien encounters -- Fiction',
            'Man-woman relationships -- Fiction',
            'Moon -- Fiction',
            'Motion picture industry -- Fiction',
            'Science fiction',
            'Titan (Satellite) -- Fiction',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/68076/pg68076.cover.medium.jpg',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/68076.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/68076.epub.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/68076.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/68076.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/68076/68076-0.txt',
            'application/octet-stream': 'https://www.gutenberg.org/files/68076/68076-h.zip',
            'application/zip': 'https://www.gutenberg.org/files/68076/68076-0.zip',
            'text/html': 'https://www.gutenberg.org/files/68076/68076-h/68076-h.htm',
          },
          download_count: 1277,
        },
        {
          id: 68107,
          title: 'Juke-Box',
          authors: [
            {
              name: 'Moore, C. L. (Catherine Lucile)',
              birth_year: 1911,
              death_year: 1987,
            },
            {
              name: 'Kuttner, Henry',
              birth_year: 1915,
              death_year: 1958,
            },
          ],
          translators: [],
          subjects: [
            'Bars (Drinking establishments) -- Fiction',
            'Jukeboxes -- Fiction',
            'Science fiction',
            'Short stories',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/68107/68107-0.txt',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/68107.kindle.images',
            'text/html': 'https://www.gutenberg.org/ebooks/68107.html.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/68107.rdf',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/68107/pg68107.cover.small.jpg',
            'application/octet-stream': 'https://www.gutenberg.org/files/68107/68107-0.zip',
            'text/plain': 'https://www.gutenberg.org/ebooks/68107.txt.utf-8',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/68107.epub.images',
          },
          download_count: 1251,
        },
        {
          id: 31516,
          title: 'The Eyes Have It',
          authors: [
            {
              name: 'Dick, Philip K.',
              birth_year: 1928,
              death_year: 1982,
            },
          ],
          translators: [],
          subjects: ['Humorous stories', 'Science fiction', 'Short stories'],
          bookshelves: ['Science Fiction'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/html': 'https://www.gutenberg.org/ebooks/31516.html.images',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/31516.kindle.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/31516.rdf',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/31516.epub.images',
            'text/plain': 'https://www.gutenberg.org/ebooks/31516.txt.utf-8',
            'text/html; charset=utf-8': 'https://www.gutenberg.org/files/31516/31516-h/31516-h.htm',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/31516/31516.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/31516/pg31516.cover.small.jpg',
          },
          download_count: 1240,
        },
        {
          id: 59,
          title: 'Discourse on the Method of Rightly Conducting Ones Reason and of Seeking Truth in the Sciences',
          authors: [
            {
              name: 'Descartes, René',
              birth_year: 1596,
              death_year: 1650,
            },
          ],
          translators: [
            {
              name: 'Veitch, John',
              birth_year: 1829,
              death_year: 1894,
            },
          ],
          subjects: ['Methodology', 'Science -- Methodology'],
          bookshelves: ['Harvard Classics', 'Philosophy'],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/59.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/59.rdf',
            'text/plain': 'https://www.gutenberg.org/ebooks/59.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/59.kindle.images',
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/59/59-0.txt',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/59/pg59.cover.small.jpg',
            'application/zip': 'https://www.gutenberg.org/files/59/59-0.zip',
            'text/html': 'https://www.gutenberg.org/ebooks/59.html.images',
          },
          download_count: 1234,
        },
        {
          id: 1672,
          title: 'Gorgias',
          authors: [
            {
              name: 'Plato',
              birth_year: -428,
              death_year: -348,
            },
          ],
          translators: [
            {
              name: 'Jowett, Benjamin',
              birth_year: 1817,
              death_year: 1893,
            },
          ],
          subjects: [
            'Classical literature',
            'Ethics -- Early works to 1800',
            'Political science -- Early works to 1800',
          ],
          bookshelves: [],
          languages: ['en'],
          copyright: false,
          media_type: 'Text',
          formats: {
            'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/1672/1672-0.txt',
            'application/octet-stream': 'https://www.gutenberg.org/files/1672/1672-0.zip',
            'text/plain': 'https://www.gutenberg.org/ebooks/1672.txt.utf-8',
            'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/1672.kindle.images',
            'application/epub+zip': 'https://www.gutenberg.org/ebooks/1672.epub.images',
            'application/rdf+xml': 'https://www.gutenberg.org/ebooks/1672.rdf',
            'text/html': 'https://www.gutenberg.org/ebooks/1672.html.images',
            'image/jpeg': 'https://www.gutenberg.org/cache/epub/1672/pg1672.cover.small.jpg',
            'application/zip': 'https://www.gutenberg.org/files/1672/1672-h.zip',
          },
          download_count: 1154,
        },
      ],
    };

    const description =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate. In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc. Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum. Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam. Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis, neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices. Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus. Morbi sollicitudin placerat leo, ut viverra ante semper dignissim. Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque. Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.';

    books.results.forEach((book) => {
      const command = new CreateBookCommand(
        book.title,
        description,
        book['formats']['image/jpeg'],
        'r9n16bJtQlpxxrTTThEKn',
        this.getRandomFloat(9, 40, 2)
      );
      this.commandBus.send(command);
    });

    return res.json(ok('Successfully created the book', undefined));
  }

  getRandomFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
  }
}
