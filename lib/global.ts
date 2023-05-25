import { util } from "./util";
import { Peer } from "./peer";
import { DHD_Peer } from "./dhd_peer";

(<any>window).peerjs = {
	Peer,
	util,
};
/** @deprecated Should use peerjs namespace */
(<any>window).Peer = Peer;
(<any>window).DHD_Peer = DHD_Peer;
