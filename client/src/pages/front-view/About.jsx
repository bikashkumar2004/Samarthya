import { assets } from "../../assets/assets";

export default function About() {
  return (
    <div className="w-full py-16 px-5 md:px-20 bg-[#f5f5f5]">
      <div className="w-full mx-auto flex flex-col items-center">
        <img
          src={assets.about}
          alt="About"
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-auto object-contain"
        />

        {/* Text below image */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#043927] mb-4">
            The #1 CRM Solutions For <br />Businesses Of All Kind
          </h1>
          <div className="px-40">
            <p className="text-base sm:text-lg text-gray-700">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero error
            consequuntur, quibusdam ut eos hic labore in laboriosam culpa suscipit
            molestiae alias quis eaque maiores ea sed fugiat necessitatibus
            blanditiis! Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Explicabo quibusdam ipsam repellendus velit odit eum, iusto recusandae
            soluta dolorum porro? Totam repellat, natus recusandae repellendus
            pariatur voluptate tempore? Neque, ea! Lorem ipsum dolor sit, amet
            consectetur adipisicing elit. Quibusdam inventore dolore itaque omnis
            adipisci quasi dolorem dolor, eos eius expedita molestias animi,
            maiores reiciendis quaerat consequatur odio. Quam, dicta totam. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Quia reiciendis
            quae nemo voluptate, magni, laborum beatae suscipit cupiditate
            deserunt, aliquam tenetur minus nobis ratione possimus harum cumque
            neque dignissimos consequuntur. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Numquam tempora id quod nam vero. Quia provident,
            repellendus quibusdam accusamus asperiores natus tempore libero vel,
            odio aut officiis, illum dolorem nesciunt?
          </p> 
          </div>
        </div>
      </div>
    </div>
  );
}
