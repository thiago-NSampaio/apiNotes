const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const {user_id} = request.params;

    const [note_id] = await knex("notes").insert({
        title,
        description,
        user_id
    }); // cadastrar a nota e recuperar o id da nota cadastrada

    const linksInsert = links.map(link => {
        return {
            note_id,
            url: link
        }
    }); // percorrer os links e para cada link criar um objeto inserindo o código da nota a qual o link está vinculado e mudando de link para url

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map(name => {
        return {
            note_id,
            name,
            user_id
        }
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
}

  async show(req, res) {
    const { id } = req.params;

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");
    const note = await knex("notes").where({ id }).first();

    res.json({
      note,
      tags,
      links,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.json();
  }

  async index(req, res) {
    const { user_id, title, tags } = req.query;
    
      let notes;

      if (tags) {
          const filterTags = tags.split(',').map(tag => tag.trim());
          console.log(tags)

          notes = await knex("tags")
              .select([
                  "notes.id",
                  "notes.title",
                  "notes.user_id",
              ])
              .where("notes.user_id", user_id)
              .whereLike("notes.title", `%${title}%`)
              .whereIn("name", filterTags)
              .innerJoin("notes", "notes.id", "tags.note_id")
              .orderBy("notes.title");

      } else {
        notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
        ;
      }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })
      



    return res.json({ notesWithTags });
  }
}

module.exports = NotesController;
