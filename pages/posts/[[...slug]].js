import React from "react";
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://toqqtvqopcjiklnztuiz.supabase.co",
  process.env.SUPABASE_KEY
);

const Page = ({ page }) => {
  return (
    <>
      <h1>{page?.title}</h1>
      <h2>{page?.category}</h2>
      <p>{page?.time}</p>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const [category, id, slug] = context.params.slug;
  const { data } = await supabase.from("posts").select();
  const post = data.find((post) => post.id === parseInt(id));

  // return 404
  if (post === undefined) {
    return {
      notFound: true,
    };
  }

  // return 308
  if (post.category !== category || post.slug !== slug) {
    return {
      redirect: {
        destination: `/posts/${post.category}/${post.id}/${post.slug}`,
        statusCode: 301,
      },
    };
  }

  return {
    props: {
      page: {
        category: post.category,
        title: post.title,
        time: Math.random(),
      },
    },
    revalidate: 90,
  };
}

export default Page;
