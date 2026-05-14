import { Article } from "../models/Article.js";
import { User } from "../models/User.js"

async function getAllArticles(req, res) {
  try {
    let {
      category,
      author,
      search,
      page = 1,
      limit = 5,
      sort = "createdAt",
      order = "asc",
      period = "all"
    } = req.query;

    const sortOption = { [sort]: order === "asc" ? 1 : -1 };


    page = Number(page);
    limit = Number(limit);

    let query = {};

    if (category) query.category = category;
    if (author) query.author = author;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ title: regex }, { text: regex }];
    }
    if (period && period !== "all") {
      const now = new Date();
      let fromDate;
      switch (period) {
        case "week":
          fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case "month":
          fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case "year":
          fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
      }
      if (fromDate) {
        query.createdAt = { $gte: fromDate };
      }
    }

    const total = await Article.countDocuments(query);

    const articles = await Article.find(query)
      .populate("author", "firstName lastName _id")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);


    const articlesWithAuthorName = articles.map((art) => ({
      ...art.toObject(),
      author: art.author ? `${art.author.firstName} ${art.author.lastName}` : null,
      authorId: art.author?._id || null,
    }));

    res.status(200).json({ total, page, limit, articles: articlesWithAuthorName });

  } catch (err) {
    console.error("getAllArticles ERROR:", err);
    res.status(500).json({ error: "Błąd przy pobieraniu artykułów" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Article.distinct("category");
    const formatted = categories.map(cat => ({ _id: cat, name: cat }));

    res.json(formatted);
  } catch (err) {
    console.error("getCategories ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

async function getAuthors(req, res) {
  try {
    const authorIds = await Article.distinct("author");
    const authors = await User.find({ _id: { $in: authorIds } }).select('_id firstName lastName');

    const authorsWithName = authors.map(author => ({
      _id: author._id,
      name: `${author.firstName} ${author.lastName}`
    }));

    res.json(authorsWithName);

  } catch (err) {
    console.error("getAuthors ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

async function getArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Nie znaleziono artykułu" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Błąd przy pobieraniu artykułu" });
  }
}

export async function createArticle(req, res) {
  try {
    const { title, text, category, author } = req.body;
    const categories = category ? JSON.parse(category) : [];
    const images = req.file
      ? [`images/${req.file.filename}`]
      : [];

    const article = await Article.create({
      title,
      text,
      category: categories,
      images,
      author: author,
    });



    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd tworzenia artykułu" });
  }
}

async function updateArticle(req, res) {
  try {

    const { id } = req.params;
    const { title, text, category } = req.body;
    const updateData = {
      title,
      text,
      category: category ? JSON.parse(category) : [],
    };

    if (req.file) {
      updateData.images = [`images/${req.file.filename}`];
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Artykuł nie znaleziony" });
    }

    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy aktualizacji artykułu" });
  }
}

async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Artykuł nie znaleziony" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd przy usuwaniu artykułu" });
  }
}

export default { getAllArticles, getArticle, createArticle, updateArticle, deleteArticle, getCategories, getAuthors }