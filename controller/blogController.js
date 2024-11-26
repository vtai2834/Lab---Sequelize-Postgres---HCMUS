const controller = {};
const models = require("../models");
const { Op } = require('sequelize')

controller.init = async (req, res, next) => {
    res.locals.categories = await models.Category.findAll({
        include: [{ model: models.Blog }],
    });
    res.locals.tags = await models.Tag.findAll();
    next();
}
controller.showList = async (req, res) => {
    let limit = 2
    let { category = 0, tag = 0, inputUser = "", page = 1 } = req.query;
    category = isNaN(category) ? 0 : parseInt(category);
    tag = isNaN(tag) ? 0 : parseInt(tag);
    page = isNaN(page) ? 1 : parseInt(page);
    let offset = (page-1) * limit;

    let option = {
        include: [{ model: models.Comment }],
        where: {},
    }

    //neu người dùng có chọn category -> lọc theo category
    if (category) {
        option.where.categoryId = category;
    }

    //neu người dùng có chọn tag -> lọc theo tag
    if (tag) {
        option.include.push({ model: models.Tag, where: { id: tag } });
    }

    //neu người dùng nhập tìm kiếm -> lọc theo input
    if (inputUser.trim() != "") {
        option.where[Op.or] = {
            title: { [Op.iLike]: `%${inputUser.trim()}%` },
            summary: { [Op.iLike]: `%${inputUser.trim()}%` }
        };
    }

    let totalRows = await models.Blog.count({
        ...option,
        distinct: true,
        col: "id"
    });
    res.locals.pagination = {
        page, limit, totalRows, queryParams: req.query
    }
    let blogs = await models.Blog.findAll({...option, limit, offset}); // select * from Blogs
    res.locals.blogs = blogs;
    res.render("index");
}

controller.showDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let blog = await models.Blog.findOne({
        where: { id },
        include: [
            { model: models.Comment },
            { model: models.User },
            { model: models.Category },
            { model: models.Tag },
        ],
    });
    res.locals.blog = blog;
    res.render("details");
}

module.exports = controller;