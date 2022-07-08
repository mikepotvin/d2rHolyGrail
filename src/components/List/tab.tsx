import { Box, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Checkbox } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Trans, useTranslation } from 'react-i18next';
import DoneIcon from '@mui/icons-material/Done';

import { IUniqueArmors, IUniqueWeapons, IUniqueOther, ISetItems } from 'd2-holy-grail/client/src/common/definitions/union/IHolyGrailData';
import { GameMode, GrailType, HolyGrailStats, ItemsInSaves, SaveFileStats, Settings } from '../../@types/main.d';

import runeBgImg from '../../../assets/rune.svg';

import { title } from '.';
import Popup from './popup';
import { Statistics } from '../Stats';
import { ChangeEvent, MouseEvent } from 'react';
import { simplifyItemName } from '../../utils/objects';
import { CountLabel, CountLabelContainer, MissingOnlySwitch, Rune, RuneBg, RuneIcon, RuneList, RuneName } from './styles';
import { runesMapping } from '../../../electron/lib/runesMapping';
import { runewordsMapping } from '../../../electron/lib/runewordsMapping';
import RunePopup from './runePopup';

type TabPanelProps = {
  index: number,
  value: number,
  items?: IUniqueArmors | IUniqueWeapons | IUniqueOther,
  sets?: ISetItems,
  stats?: SaveFileStats,
  runes?: {[runeId: string]: string},
  runewords?: {[runewordId: string]: string}
  player: ItemsInSaves,
  ethPlayer: ItemsInSaves,
  search: string,
  noFileSummary?: boolean,
  noAnimation?: boolean,
  appSettings: Settings,
  holyGrailStats: HolyGrailStats,
};

const getRuneIcon = (runeType: string): string => {
  const runeNo = parseInt(runeType.replace("r", ""));
  return "123456789ABCDEFGHIJKLMNOPQRSTUVWX".charAt(runeNo - 1);
}

export function TabPanel(props: TabPanelProps) {
  const { value, index, items, sets, runes, runewords, player, ethPlayer, stats, search, noFileSummary, noAnimation, appSettings, holyGrailStats } = props;
  const { gameMode, grailType } = appSettings;
  const { t } = useTranslation();

  let itemList = items || sets || runewords || runes;
  if (value === index) {
    if (itemList && search.trim().length) {
      const latinMap: {[key:string]: string} = { "Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
      const simplifyName = (str: string) => str.toLowerCase().replace(/[^A-Za-z0-9[\] ]/g,(a) => latinMap[a] || a).replace(/[^a-z0-9   ]/gi, '');
      const searchStr = search.trim().length ? simplifyName(search) : null;
      const filterWithSearch = (object: {[key: string]: any}, search: string): {[key: string]: any} => {
        const out: {[key: string]: any} = {};
        Object.keys(object).forEach((key: string) => {
          if (typeof object[key] === 'object' && Object.keys(object[key]).length > 0) {
            const leaf = filterWithSearch(object[key], search);
            if (Object.keys(leaf).length) {
              out[key] = leaf;
            }
          } else {
            if (simplifyName(t(key)).indexOf(search) !== -1) {
              out[key] = object[key];
            }
          }
        });
        return out;
      }
      // @ts-ignore
      itemList = filterWithSearch(itemList, searchStr);
    }
  }

  if (appSettings.onlyMissing) {
    if (itemList) {
      const filterWithOnlyMissing = (object: {[key: string]: any}): {[key: string]: any} => {
        const out: {[key: string]: any} = {};
        Object.keys(object).forEach((key: string) => {
          if (typeof object[key] === 'object' && Object.keys(object[key]).length > 0) {
            const leaf = filterWithOnlyMissing(object[key]);
            if (Object.keys(leaf).length) {
              out[key] = leaf;
            }
          } else {
            const simplified = simplifyItemName(key);
            if (!player[simplified] && !ethPlayer[simplified]) {
              out[key] = object[key];
            }
          }
        });
        return out;
      }
      // @ts-ignore
      itemList = filterWithOnlyMissing(itemList);
    }
  }

  console.log('itemList', itemList);

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>, itemName: string) => {
    window.Main.saveManualItem(itemName, event.target.checked);
  }
  const handleEthStatusChange = (event: ChangeEvent<HTMLInputElement>, itemName: string) => {
    window.Main.saveManualEthItem(itemName, event.target.checked);
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%' }}
    >
      {itemList && !search && appSettings.onlyMissing && Object.keys(itemList).length === 0 && (
        <Box sx={{ p: 3, pt: 5 }}>
          <Trans>No missing items</Trans>
        </Box>
      )}
      {value === index && items && (
        <Box sx={{ p: 3, pt: 0 }}>
          {Object.keys((itemList as any)).map((type) => {
            return <div key={type}>
              <Typography variant="h6" gutterBottom mt={2} component="div">{t(title(type))}</Typography>
              {
                  <Grid container spacing={2}>
                  {Object.keys((itemList as any)[type]).map((dif) =>
                    <Grid item md={4} key={dif}>
                      <Typography variant="subtitle1" gutterBottom component="div">{t(title(dif))}</Typography>
                      <List
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        aria-label="contacts"
                      >
                        {Object.keys((itemList as any)[type][dif]).map(
                          (itemFullName) => {
                            const itemName = simplifyItemName(itemFullName);
                            return <Popup
                              itemName={itemName}
                              fullItemName={t(itemFullName)}
                              itemType="UNIQUE"
                              key={itemName}
                              saveFiles={player[itemName] ? player[itemName].inSaves : {}}
                              ethSaveFiles={ethPlayer[itemName] ? ethPlayer[itemName].inSaves : {}}
                              appSettings={appSettings}
                            >
                              <ListItem disablePadding style={{color: player[itemName] || ethPlayer[itemName] ? grey[400] : grey[700]}}>
                                <ListItemButton>
                                  {gameMode !== GameMode.Manual && ethPlayer[itemName] ? (
                                    <CountLabelContainer>
                                      <ListItemIcon className="ethCheckbox" style={{ minWidth: 32 }}>
                                        <DoneIcon />
                                      </ListItemIcon>
                                      {
                                        ethPlayer[itemName] &&
                                        Object.keys(ethPlayer[itemName].inSaves).length > 1 &&
                                        <CountLabel className="countLabel">x{
                                          Object.values(ethPlayer[itemName].inSaves).reduce(
                                            (count, items) => count + items.length,
                                            0
                                          )
                                        }</CountLabel>
                                      }
                                    </CountLabelContainer>
                                  ) : <div style={{ width: 32, display: 'inline-block' }}></div>}
                                  {gameMode !== GameMode.Manual && player[itemName] ? (
                                    <CountLabelContainer>
                                      <ListItemIcon>
                                        <DoneIcon />
                                      </ListItemIcon>
                                      {
                                        player[itemName] &&
                                        Object.keys(player[itemName].inSaves).length > 1 &&
                                        <CountLabel className="countLabel">x{
                                          Object.values(player[itemName].inSaves).reduce(
                                            (count, items) => count + items.length,
                                            0
                                          )
                                        }</CountLabel>
                                      }
                                    </CountLabelContainer>
                                  ) : <div style={{ width: 56, display: 'inline-block' }}></div>}
                                  {gameMode === GameMode.Manual && (
                                    <ListItemIcon>
                                      {grailType === GrailType.Each && <Checkbox
                                        className="ethCheckbox"
                                        edge="start"
                                        checked={!!ethPlayer[itemName]}
                                        tabIndex={-1}
                                        disableRipple
                                        onChange={(e) => handleEthStatusChange(e, itemName)}
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                                      />}
                                      <Checkbox
                                        edge="start"
                                        checked={!!player[itemName]}
                                        tabIndex={-1}
                                        disableRipple
                                        onChange={(e) => handleStatusChange(e, itemName)}
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                                      />
                                    </ListItemIcon>
                                  )}
                                  <ListItemText primary={t(itemFullName)} />
                                </ListItemButton>
                              </ListItem>
                            </Popup>
                          })}
                      </List>
                    </Grid>
                  )}
                </Grid>
              }
            </div>
          })}
        </Box>
      )}
      {value === index && sets && (
        <Box sx={{ p: 3, pt: 0 }}>
        {
            <Grid container spacing={2}>
            {Object.keys((itemList as any)).map((set) =>
              <Grid item md={4} key={set}>
                <Typography variant="h6" gutterBottom mt={2} component="div">{t(title(set))}</Typography>
                <List
                  sx={{ width: '100%', bgcolor: 'background.paper' }}
                  aria-label="contacts"
                >
                  {Object.keys((itemList as any)[set]).map(
                    (itemFullName) => {
                      const itemName = simplifyItemName(itemFullName);
                      return <Popup
                        itemName={itemName}
                        fullItemName={t(itemFullName)}
                        itemType="SET"
                        key={itemName}
                        saveFiles={player[itemName] ? player[itemName].inSaves : {}}
                        ethSaveFiles={ethPlayer[itemName] ? ethPlayer[itemName].inSaves : {}}
                        appSettings={appSettings}
                      >
                        <ListItem disablePadding key={itemName} style={{color: player[itemName] || ethPlayer[itemName] ? grey[400] : grey[700]}}>
                          <ListItemButton>
                            {gameMode !== GameMode.Manual && ethPlayer[itemName] ? (
                              <CountLabelContainer>
                                <ListItemIcon className="ethCheckbox" style={{ minWidth: 32 }}>
                                  <DoneIcon />
                                </ListItemIcon>
                                {
                                  ethPlayer[itemName] &&
                                  Object.keys(ethPlayer[itemName].inSaves).length > 1 &&
                                  <CountLabel className="countLabel">x{
                                    Object.values(ethPlayer[itemName].inSaves).reduce(
                                      (count, items) => count + items.length,
                                      0
                                    )
                                  }</CountLabel>
                                }
                              </CountLabelContainer>
                            ) : <div style={{ width: 32, display: 'inline-block' }}></div>}
                            {gameMode !== GameMode.Manual && player[itemName] ? (
                              <CountLabelContainer>
                                <ListItemIcon>
                                  <DoneIcon />
                                </ListItemIcon>
                                {
                                  player[itemName] &&
                                  Object.keys(player[itemName].inSaves).length > 1 &&
                                  <CountLabel className="countLabel">x{
                                    Object.values(player[itemName].inSaves).reduce(
                                      (count, items) => count + items.length,
                                      0
                                    )
                                  }</CountLabel>
                                }
                              </CountLabelContainer>
                            ) : <div style={{ width: 56, display: 'inline-block' }}></div>}
                            {gameMode === GameMode.Manual && (
                              <ListItemIcon>
                                {grailType === GrailType.Each && <Checkbox
                                  className="ethCheckbox"
                                  edge="start"
                                  checked={!!ethPlayer[itemName]}
                                  tabIndex={-1}
                                  disableRipple
                                  onChange={(e) => handleEthStatusChange(e, itemName)}
                                  onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                                />}
                                <Checkbox
                                  edge="start"
                                  checked={!!player[itemName]}
                                  tabIndex={-1}
                                  disableRipple
                                  onChange={(e) => handleStatusChange(e, itemName)}
                                  onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                                />
                              </ListItemIcon>
                            )}
                            <ListItemText primary={t(itemFullName)} />
                          </ListItemButton>
                        </ListItem>
                      </Popup>
                    })}
                </List>
              </Grid>
            )}
          </Grid>
        }
        </Box>
      )}
      {value === index && runes && !runewords && (
        <Box sx={{ p: 3 }}>
        {
            <Grid container spacing={2}>
            {Object.keys((runes as any)).map((itemName: string) => {
              const runeId = (itemList as any)[itemName];
              if (!runeId) return;
              const rune = runesMapping[runeId];
              return <Grid item md={3} sm={4} xs={6} key={itemName}>
                <RunePopup
                  itemName={itemName}
                  fullItemName={rune.name}
                  itemType={runeId}
                  key={itemName}
                  saveFiles={player[itemName] ? player[itemName].inSaves : {}}
                  appSettings={appSettings}
                  disabled={!player[itemName]}
                >
                  <ListItem disablePadding key={itemName} style={{color: player[itemName] ? grey[400] : grey[700]}}>
                    <ListItemButton>
                      {gameMode !== GameMode.Manual && player[itemName] ? (
                        <CountLabelContainer>
                          <ListItemIcon>
                            <DoneIcon />
                          </ListItemIcon>
                          {
                            player[itemName] &&
                            Object.keys(player[itemName].inSaves).length > 1 &&
                            <CountLabel className="countLabel">x{
                              Object.values(player[itemName].inSaves).reduce(
                                (count, items) => count + items.length,
                                0
                              )
                            }</CountLabel>
                          }
                        </CountLabelContainer>
                      ) : <div style={{ width: 56, display: 'inline-block' }}></div>}
                      {gameMode === GameMode.Manual && (
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={!!player[itemName]}
                            tabIndex={-1}
                            disableRipple
                            onChange={(e) => handleStatusChange(e, itemName)}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={<>
                          <Rune style={{ opacity: player[itemName] ? 1 : 0.5 }}>
                            <RuneBg src={runeBgImg} />
                            <RuneIcon>{getRuneIcon(runeId)}</RuneIcon>
                          </Rune>
                          {rune.name}
                        </>}
                      />
                    </ListItemButton>
                  </ListItem>
                </RunePopup>
              </Grid>
            }
          )}
          </Grid>
        }
        </Box>
      )}
      {value === index && runewords && (
        <Box sx={{ p: 3 }}>
        {
            <Grid container spacing={0}>
            {Object.keys((runewords as any)).map((itemName: string) => {
              const runewordId = (itemList as any)[itemName];
              if (!runewordId) return;
              const runeword = runewordsMapping[runewordId];
              return <Grid item md={4} xs={6} key={itemName}>
                <RunePopup
                  itemName={itemName}
                  fullItemName={t(runeword.name)}
                  itemType={'RUNEWORD'}
                  key={itemName}
                  saveFiles={player[itemName] ? player[itemName].inSaves : {}}
                  appSettings={appSettings}
                  disabled={!player[itemName]}
                >
                  <ListItem disablePadding key={itemName} style={{color: player[itemName] ? grey[400] : grey[700]}}>
                    <ListItemButton>
                      {gameMode !== GameMode.Manual && player[itemName] ? (
                        <CountLabelContainer>
                          <ListItemIcon>
                            <DoneIcon />
                          </ListItemIcon>
                          {
                            player[itemName] &&
                            Object.keys(player[itemName].inSaves).length > 1 &&
                            <CountLabel className="countLabel">x{
                              Object.values(player[itemName].inSaves).reduce(
                                (count, items) => count + items.length,
                                0
                              )
                            }</CountLabel>
                          }
                        </CountLabelContainer>
                      ) : <div style={{ width: 56, display: 'inline-block' }}></div>}
                      {gameMode === GameMode.Manual && (
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={!!player[itemName]}
                            tabIndex={-1}
                            disableRipple
                            onChange={(e) => handleStatusChange(e, itemName)}
                            onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation() }}
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={<h3>{runeword.name}</h3>}
                        secondary={<RuneList>{runeword.runes.map(runeName => {
                          const rune = runes && runes[runeName] && runesMapping[runes[runeName]];
                          if (!rune) return;
                          return <Rune style={{ opacity: player[itemName] ? 1 : 0.5 }}>
                            <RuneBg src={runeBgImg} />
                            <RuneIcon>{getRuneIcon(runes[runeName])}</RuneIcon>
                            <RuneName>{rune.name}</RuneName>
                          </Rune>;
                        })}</RuneList>}
                      />
                    </ListItemButton>
                  </ListItem>
                </RunePopup>
              </Grid>
            }
          )}
          </Grid>
        }
        </Box>
      )}
      {value === index && !sets && !items && stats && (
        <Statistics
          stats={!noFileSummary && gameMode !== GameMode.Manual ? stats : undefined}
          noAnimation={noAnimation}
          appSettings={appSettings}
          holyGrailStats={holyGrailStats}
        />
      )}
    </div>
  );
}
