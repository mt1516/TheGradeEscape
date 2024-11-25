export default function Instruction() {
  return (
    <div className="container flex flex-row w-full h-5/6">
      <div className="container flex flex-col w-1/2 h-full text-black">
        <div className="text-3xl font-bold">Common goal: Excape. </div>
        <div className="text-3xl">- Start at bottom left.</div>
        <div className="text-3xl">- Reach the top right corner of the grid.</div>
        <div className="text-3xl font-bold"> <br /> Game modes:</div>
        <div className="text-3xl"> - Don't Take Wrong Steps: </div>
        <div className="text-2xl mx-4"> You will lost if you exceed the max. steps allowed </div>
        <div className="text-3xl"> - Dancing In The Dark : </div>
        <div className="text-2xl mx-4"> You can only see part of the map </div>
        <div className="text-3xl"> - Don't Bump The Wall: </div>
        <div className="text-2xl mx-4"> You will lose heart if you pump into walls </div>
      </div>
      <div className="container flex flex-col w-1/2 h-full text-black">
        <div className="text-3xl font-bold"> Storyline: </div>
        <div className="text-3xl">- Start: </div>
        <div className="text-xl mx-4"> You got no choice, and got into the University of Stress of Tension </div>
        <div className="text-3xl">- Don't Take Wrong Steps: </div>
        <div className="text-xl mx-4"> Make your steps carefully. You don't want to get anything wrong. <br /> There is no going back...  </div>
        <div className="text-3xl">- Dancing In The Dark: </div>
        <div className="text-xl mx-4"> You are studying very late in a thunderstorm night... </div>
        <div className="text-3xl">- Don't Bump The Wall: </div>
        <div className="text-xl mx-4"> You professor will deduct your marks if you get something wrong !!! </div>
        <div className="text-3xl">- Final Exam: </div>
        <div className="text-xl mx-4"> It's time to show your full potential. Professor will spam difficult questions to you after 15s of preparation time. You should make it through with your fully prepared skills. Ga Yau !!! </div>
        <div className="text-3xl">- End: </div>
        <div className="text-xl mx-4"> Finally you make it. No matter what grade you end up in, no matter what honer you end in, it does not matter anymore. You can move on to your next stage. Charlie Chaplin once said "Life is a tragedy when seen in close-up, but a comedy in long-shot." Study is just a sh#rt pe$i&d of y*ur li&* a@d t&e^e #@$ </div>
      </div>
      <div className="absolute bottom-[4%] right-[34%] w-1/6 h-fit my-auto container flex flex-row justify-center items-center">
        <div className=" text-red-600 text-3xl w-full h-full text-center">
          Error - Start again?
        </div>
      </div>
    </div>
  );
}