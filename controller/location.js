import Location from "../model/location.js";

const locations = async (req, res) => {
    const q = req.query.q;
    try {
        const location = await Location.find({ formatted_address: { $regex: q, $options: 'i' } });
        res.json(location);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching locations"
        });
    }
}

export { locations };