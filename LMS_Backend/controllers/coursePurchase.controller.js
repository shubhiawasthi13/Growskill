import Stripe from "stripe";
import { Course } from "../modal/course.modal.js";
import { CoursePurchase } from "../modal/coursePurchase.modal.js";
import { User } from "../modal/user.modal.js";
import { Lecture } from "../modal/lecture.modal.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // fixed typo here

export const createCheckoutSeesion = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud", // AUD for Australia
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://groww-skill.netlify.app/`,
      cancel_url: `https://groww-skill.netlify.app/`,
      metadata: {
        courseId,
        userId,
      },
      shipping_address_collection: {
        allowed_countries: ["AU", "IN"],
      },
    });

    if (!session.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to create checkout session",
      });
    }

    // Create and save the CoursePurchase *after* getting paymentId
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: session.id, // ✅ set before saving
    });

    await newPurchase.save(); // ✅ now save

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Checkout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

export const stripeWebHook = async (req, res) => {
  let event;
  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.log("Webhook Error", error.message);
    return res.status(404).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }

      purchase.status = "completed";
      await purchase.save();

      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrollCourses: purchase.courseId._id } },
        { new: true }
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};


export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    return res.status(200).json({
      course,
      purchased: purchased?.status === "completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get courseDetail with purchase status",
    });
  }
};


export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(400).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get purchase course",
    });
  }
};
