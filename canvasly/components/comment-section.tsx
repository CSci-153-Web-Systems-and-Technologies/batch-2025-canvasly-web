import React from "react";
import { Button } from "./ui/button";
import CommentInput from "./comment-input";
import Comment from "./comment";
import { ChevronDown } from "lucide-react";

const CommentSection = ({ comments, postId, queryId }) => {
  const [expanded, setExpanded] = React.useState(false);

  console.log(`⚠️ COMMENT-SECTION.TSX ${postId}`);

  return (
    <div className="flex flex-col w-full gap-2">
      {comments?.length > 1 && (
        <div className="flex flex-col gap-4">
          <Button
            className=" p-6"
            variant="ghost"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <ChevronDown color="#303030" />
              <span>Show more comments</span>
              <div className="py-0.5 px-3 flex flex-row items-center justify-center rounded-2xl  bg-[#8c8c8c] text-white">{`${comments?.length}`}</div>
            </div>
          </Button>
        </div>
      )}
      {comments?.length > 0 && (
        <div className="flex flex-col gap-2">
          {!expanded ? (
            <Comment data={comments[comments.length - 1]} />
          ) : (
            comments.map((comment, index) => (
              <Comment data={comment} key={index} />
            ))
          )}
        </div>
      )}

      <CommentInput
        setExpanded={setExpanded}
        postId={postId}
        queryId={queryId}
      />
    </div>
  );
};

export default CommentSection;
