import {Module} from "@nestjs/common";
import {UniqueID} from "src/Utils/UniqueID";
import {SharedContainer} from "./SharedContainer";

@Module({
  imports: [],
  exports: [SharedContainer],
  providers: [SharedContainer, UniqueID],
})
export class SharedModule {}
